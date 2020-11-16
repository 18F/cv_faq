#!/usr/bin/env python3
"""
Create an Azure Cognitives Services Knowledge Base associated with a service
plan. This script assumes that there should only be one knowledge base per
service plan, which is the use-case for the CV-FAQ chatbot.
"""

import argparse
import json
import urllib.request
import sys
import time


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--cognitive-account',
        action='store',
        help='Cognitive account name'
    )
    parser.add_argument(
        '--source-file',
        action='store',
        help='Knowledge base JSON source file'
    )
    parser.add_argument(
        '--access-key',
        action='store',
        help='Subscription key'
    )
    return parser.parse_args()


def get_knowledgebases(*, endpoint, access_key, cognitive_account):
    print('Getting existing knowledge bases...')
    url = f'{endpoint}qnamaker/v4.0/knowledgebases'
    request = urllib.request.Request(
        url=url,
        method='GET',
        headers={
            'Ocp-Apim-Subscription-Key': access_key,
        }
    )
    try:
        response = urllib.request.urlopen(request)
        response_str = response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        print(str(e))
        response_str = e.read().decode()

    print('Got response', response_str)
    data = json.loads(response_str)
    knowledge_bases = [
        knowledge_base
        for knowledge_base in data['knowledgebases']
        if knowledge_base['hostName'] == f'https://{cognitive_account}.azurewebsites.net'
    ]
    return knowledge_bases


def replace_knowledgebase(*, endpoint, knowledge_base_location, kb_file_bytes, access_key):
    print('Replacing knowledge base content...')
    url = f'{endpoint}qnamaker/v4.0{knowledge_base_location}'
    print(f'Putting to {url} ...')
    request = urllib.request.Request(
        url=url,
        method='POST',
        data=kb_file_bytes,
        headers={
            'Content-Type': 'application/json; charset=utf-8',
            'Ocp-Apim-Subscription-Key': access_key,
        }
    )
    try:
        response = urllib.request.urlopen(request)
        response_str = response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        print(str(e))
        response_str = e.read().decode()

    print('Got response', response.code, response_str)
    return response.code == 204


def create_knowledgebase(*, endpoint, kb_file_bytes, access_key):
    print('Creating knowledge base...')
    url = f'{endpoint}qnamaker/v4.0/knowledgebases/create'
    print(f'Posting to {url} ...')
    request = urllib.request.Request(
        url=url,
        method='POST',
        data=kb_file_bytes,
        headers={
            'Content-Type': 'application/json; charset=utf-8',
            'Ocp-Apim-Subscription-Key': access_key,
        }
    )
    try:
        response = urllib.request.urlopen(request)
        response_str = response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        print(str(e))
        response_str = e.read().decode()

    print('Got response', response_str)
    return json.loads(response_str)


def create_knowledgebase_retry(*,
    max_attempts=10,
    retry_seconds=300,
    endpoint,
    kb_file_bytes,
    access_key
):
    attempt = 0
    while True:
        response = create_knowledgebase(
            endpoint=endpoint,
            kb_file_bytes=kb_file_bytes,
            access_key=access_key
        )

        if 'error' not in response:
            return response

        attempt += 1
        print('Error creating knowledge base...', response['error'])

        if attempt == max_attempts:
            print('Done retrying.')
            return response

        print(f'Will retry, sleeping {retry_seconds}...')
        time.sleep(retry_seconds)


def check_status(*, endpoint, access_key, operation_id):
    print('Checking create operation status...')
    request = urllib.request.Request(
        f'{endpoint}qnamaker/v4.0/operations/{operation_id}',
        method='GET',
        headers={
            'Accept': 'application/json; charset=utf-8',
            'Ocp-Apim-Subscription-Key': access_key,
        }
    )
    response = urllib.request.urlopen(request)
    json_str = response.read().decode('utf-8')
    print('Got response', json_str)
    return json.loads(json_str)


def check_status_retry(
    *,
    endpoint,
    access_key,
    operation_id,
    max_attempts=20,
    retry_seconds=20,
):
    attempt = 0
    status = None

    while True:
        attempt += 1
        print(f'Checking status, try {attempt} of {max_attempts}...')
        status = check_status(
            endpoint=endpoint,
            access_key=access_key,
            operation_id=operation_id,
        )
        operation_status = status['operationState']

        if 'resourceLocation' in status:
            print('Successfully created!', status['resourceLocation'])
            return status['resourceLocation']

        if status['operationState'] == 'Failed':
            print('Creation failed! Exiting...')
            break

        if attempt == max_attempts:
            print('Tried {max_attempts} times, exiting...')
            break

        print(f'Operation state is "{operation_status}", sleeping {retry_seconds} seconds...')
        time.sleep(retry_seconds)

    return None


def publish_knowledge_base(endpoint, knowledge_base_location, access_key):
    print('Publishing knowledge base...')
    request = urllib.request.Request(
        f'{endpoint}qnamaker/v4.0{knowledge_base_location}',
        method='GET',
        headers={
            'Accept': 'application/json; charset=utf-8',
            'Ocp-Apim-Subscription-Key': access_key,
        }
    )
    response = urllib.request.urlopen(request)
    json_str = response.read().decode('utf-8')
    print('Got response', json_str)
    return response.code == 200


def main():
    args = parse_args()

    endpoint = f'https://{args.cognitive_account}.cognitiveservices.azure.com/'

    # If we already have a knowledge base for the given app service name,
    # don't create another one create one.
    knowledge_bases = get_knowledgebases(
        endpoint=endpoint,
        access_key=args.access_key,
        cognitive_account=args.cognitive_account
    )
    if len(knowledge_bases) > 1:
        print(len(knowledge_bases), 'knowledge bases exist. Should be 1 or 0!')
        sys.exit(1)

    with open(args.source_file, 'rb') as source_file:
        kb_file_bytes = source_file.read()
        if knowledge_bases:
            print('Knowledge base already exists; updating...', knowledge_bases[0]['id'])
            knowledge_base_location = f'/knowledgebases/{knowledge_bases[0]["id"]}'
            success = replace_knowledgebase(
                endpoint=endpoint,
                knowledge_base_location=knowledge_base_location,
                kb_file_bytes=kb_file_bytes,
                access_key=args.access_key
            )
            if not success:
                print('Error replacing knowledge base; exiting...')
                sys.exit(1)

        else:
            print('Knowledge base does not exist; creating...')
            response = create_knowledgebase_retry(
                endpoint=endpoint,
                kb_file_bytes=kb_file_bytes,
                access_key=args.access_key
            )
            if 'error' in response:
                print(
                    'Error creating knowledge base, exiting...',
                    response['error']
                )
                sys.exit(1)
            operation_id = response['operationId']

            knowledge_base_location = check_status_retry(
                endpoint=endpoint,
                access_key=args.access_key,
                operation_id=operation_id,
            )
            if knowledge_base_location is None:
                sys.exit(1)

    published = publish_knowledge_base(
        endpoint=endpoint,
        knowledge_base_location=knowledge_base_location,
        access_key=args.access_key,
    )
    if not published:
        print('Error publishing knowledge base!')
        sys.exit(1)

    print('Successfully published knowledge base!')
    print(knowledge_base_location)
    sys.exit(0)


if __name__ == "__main__":
    main()

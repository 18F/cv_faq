#!/usr/bin/env python3
"""
Create an Azure Cognitives Services Knowledge Base associated with a service
plan. This script assumes that there should only be one knowledge base per
service plan, which is the use-case for the CV-FAQ chatbot.
"""

import argparse


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--app-service-name',
        action='store',
        help='Knowledge base JSON source file'
    )
    parser.add_argument(
        '--endpoint',
        action='store',
        help='Azure Cognitive API domain name'
    )
    parser.add_argument(
        '--access-key',
        action='store',
        help='Subscription key'
    )
    return parser.parse_args()

def main():
    args = parse_args()
    print(f'TODO: Destroy Knowledge Bases in {args.app_service_path}')

if __name__ == '__main__':
    main()

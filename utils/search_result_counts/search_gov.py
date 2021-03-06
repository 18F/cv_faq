"""
Makes requests to search.gov.
"""

from typing import Any, Dict, List

import requests
import requests_cache


# Scopes the search.gov search to faq.coronavirus.gov
SEARCH_GOV_PROPERTY = 'faq.coronavirus.gov'
SEARCH_GOV_KEY = 'ACSIQG9J_Xe7h9TTxjMrNqfUCp9O3ryactfBybCMIGc='
SEARCH_GOV_ENDPOINT = 'https://search.usa.gov/api/v2/search/i14y'


def _get_web_search_results_count(results):
    # search.gov returns counts that aren't consistent with the actual list
    # returned. in the event we get a list with zero values, treat as zero
    # results; otherwise, use the "total" count.
    web = results.get('web', {})

    have_results = len(web.get('results', [])) > 0
    if not have_results:
        return 0

    return web.get('total', 0)


def parse_results(results: Dict[str, Any]):
    return {
        'is_routed_query': 'route_to' in results,
        'search': _get_web_search_results_count(results),
        'text_best_bets': len(results.get('text_best_bets', [])),
        'graphic_best_bets': len(results.get('graphic_best_bets', [])),
        'health_topics': len(results.get('health_topics', [])),
        'job_openings': len(results.get('job_openings', [])),
        'recent_tweets': len(results.get('recent_tweets', [])),
        'federal_register_documents': len(results.get('federal_register_documents', [])),
        'related_search_terms': len(results.get('related_search_terms', []))
    }


def get_result_counts(keywords: str):
    response = requests.get(
        SEARCH_GOV_ENDPOINT,
        params={
            'affiliate': SEARCH_GOV_PROPERTY,
            'access_key': SEARCH_GOV_KEY,
            'query': keywords,
            # We would ideally just set a limit of "1", but search.gov is
            # strangely unreliable on the counts that are returned, and a
            # larger number increases some reliability.
            # (See `_get_web_search_results_count` above)
            'limit': 4,
            'offset': 0
        },
        headers={
            'User-Agent': 'https://github.com/18F/cv_faq/tree/master/utils/search_result_counts/'
        }
    )
    return parse_results(response.json())


def get_all_result_counts(keywords_list: List[str]):
    """
    Synchronously get each term.
    This could be made more efficient by doing concurrent requests.
    """

    return {
        keywords: get_result_counts(keywords)
        for keywords in keywords_list
    }


def get_total_results_count(counts: Dict[str, Any]):
    return sum(
        value
        for key, value in counts.items()
        if key != 'is_routed_query'
    )


def should_expose_suggestion(counts: Dict[str, Any], min_count: int):
    above_threshold = get_total_results_count(counts) > min_count
    return above_threshold or counts['is_routed_query']

from .search_gov import parse_results


def test_parse_with_results():
    assert parse_results({
        "query": "covid",
        "web": {
            "total": 259,
            "next_offset": 1,
            "spelling_correction": None,
            "results": []
        },
        "text_best_bets": [
            {
                "id": 147617,
                "title": "Who is at higher risk for serious illness from \ue000COVID\ue001-19?",
                "url": "https://faq.coronavirus.gov/underlying-conditions/who-is-at-higher-risk-for-serious-illness-from-covid-19/",
                "description": "\ue000COVID\ue001-19 is a new disease and there is limited information regarding risk factors for severe disease. Based on currently available information and clinical expertise, older adults and people of any age who have serious underlying medical conditions might"
            }
        ],
        "graphic_best_bets": [],
        "health_topics": [],
        "job_openings": [],
        "recent_tweets": [],
        "federal_register_documents": [],
        "related_search_terms": []
    }) == {
        'routed_query': False,
        'search': 259,
        'text_best_bets': 1,
        'graphic_best_bets': 0,
        'health_topics': 0,
        'job_openings': 0,
        'recent_tweets': 0,
        'federal_register_documents': 0,
        'related_search_terms': 0
    }


def test_best_bets():
    assert parse_results({
        "query": "tested",
        "web": {
            "total": 31,
            "next_offset": 1,
            "spelling_correction": None,
            "results": [
                {
                    "title": "Why are animals being \ue000tested\ue001 when many people can\u2019t get \ue000tested\ue001? - COVID-19 Answers",
                    "url": "https://faq.coronavirus.gov/animals/why-are-animals-being-tested-when-people-cant/",
                    "snippet": "Animals are only being \ue000tested\ue001 in very rare circumstances...are animals being \ue000tested\ue001 when many people can\u2019t get \ue000tested\ue001? Why are animals being...being \ue000tested\ue001 when many people can\u2019t get \ue000tested\ue001? Animals are only being tested",
                    "publication_date": None
                }
            ]
        },
        "text_best_bets": [
            {
                "id": 148046,
                "title": "Where can I get \ue000tested\ue001 for COVID-19?",
                "url": "https://faq.coronavirus.gov/symptoms-and-testing/where-can-i-get-tested/",
                "description": "The process and locations for \ue000testing\ue001 vary from place to place. Contact your state, local, tribal, or territorial department for more information, or reach out to a medical provider. State an"
            },
            {
                "id": 147616,
                "title": "Should I be \ue000tested\ue001 for COVID-19?",
                "url": "https://faq.coronavirus.gov/symptoms-and-testing/should-i-be-tested-for-covid-19/",
                "description": "Maybe; not everyone needs to be \ue000tested\ue001 for COVID-19. If you have symptoms of COVID-19 and want to get \ue000tested\ue001, call your healthcare provider first."
            }
        ],
        "graphic_best_bets": [],
        "health_topics": [],
        "job_openings": [],
        "recent_tweets": [],
        "federal_register_documents": [],
        "related_search_terms": []
    }) == {
        'routed_query': False,
        'search': 31,
        'text_best_bets': 2,
        'graphic_best_bets': 0,
        'health_topics': 0,
        'job_openings': 0,
        'recent_tweets': 0,
        'federal_register_documents': 0,
        'related_search_terms': 0
    }


def test_no_results():
    parse_results({
        "query":"no_results_expected",
        "web": {
            "total": 0,
            "next_offset": None,
            "spelling_correction": None,
            "results": []
        },
        "text_best_bets": [],
        "graphic_best_bets": [],
        "health_topics": [],
        "job_openings": [],
        "recent_tweets": [],
        "federal_register_documents": [],
        "related_search_terms": []
    }) == {
        'routed_query': False,
        'search': 0,
        'text_best_bets': 0,
        'graphic_best_bets': 0,
        'health_topics': 0,
        'job_openings': 0,
        'recent_tweets': 0,
        'federal_register_documents': 0,
        'related_search_terms': 0
    }


def test_routed_query():
    parse_results({
        'route_to': 'https://faq.coronavirus.gov/search/?query=economic+impact+payment'
    }) == {
        'routed_query': True,
        'search': 0,
        'text_best_bets': 0,
        'graphic_best_bets': 0,
        'health_topics': 0,
        'job_openings': 0,
        'recent_tweets': 0,
        'federal_register_documents': 0,
        'related_search_terms': 0
    }

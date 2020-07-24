# flatten-categories

This helper script is written to aid with flattening the URLs for questions, removing the primary category.

For example:

https://faq.coronavirus.gov/symptoms-and-testing/should-i-be-tested-for-covid-19/

becomes:

https://faq.coronavirus.gov/should-i-be-tested-for-covid-19/

This script will update all questions in the `_content` directory, ensuring that a redirect from the original question URL to the flattened URL exists.

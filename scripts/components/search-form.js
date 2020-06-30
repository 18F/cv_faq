const SEARCH_FORM_ID = 'search_form';
const AFFILIATE_INPUT_NAME = 'affiliate';


export const initSearchForm = () => {
    const searchForm = document.getElementById(SEARCH_FORM_ID);

    // By default, the rendered form will submit to usa.search.gov.
    // Here, we modify it for Javascript-enabled browsers to render results
    // inline.

    // Set the search to the local URL.
    searchForm.action = '/search/';

    // Remove the affiliate hidden input.
    const affiliateInput = searchForm.querySelector(`input[name=${AFFILIATE_INPUT_NAME}]`);
    affiliateInput.parentNode.removeChild(affiliateInput);
}

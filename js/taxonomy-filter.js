"use strict";
class TaxonomyFilter {
    /**
     * Create eventhandlers for 'Search' and 'Reset' buttons
     */
    initEventHandlers() {
        const submitBtn = document.querySelector('#taxonomy-filter #submit');
        if (!submitBtn) {
            throw new Error('Could not find button "#taxonomy-filter #submit"');
        }
        const resetBtn = document.querySelector('#taxonomy-filter #reset');
        if (!resetBtn) {
            throw new Error('Could not find button "#taxonomy-filter #reset"');
        }
        // 'Submit' button adds Taxonomy filters to the url and navigates to it
        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            let pathname = this.getCleanPathname();
            pathname = this.addTaxonomyFiltersToPathname(pathname);
            window.location.href = pathname;
        });
        // 'Reset' button clears all checkboxes and navigates to url without Taxonumy filters
        resetBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.resetCheckboxes();
            const pathname = this.getCleanPathname();
            window.location.href = pathname;
        });
    }
    /**
     * Reset all checkboxes
     */
    resetCheckboxes() {
        const checkboxes = document.querySelectorAll('#taxonomy-filter input');
        for (const checkbox of checkboxes) {
            checkbox.checked = false;
        }
    }
    /**
     * Removes all Taxonomy filters (`/tag:photography`) and Pagination index (`/page:2`) from `document.location.pathname`.
     *
     * @returns The url of the page without Taxonomy filters
     */
    getCleanPathname() {
        let pathname = document.location.pathname;
        // For every input field, remove it from the filters in the Url
        const checkboxes = document.querySelectorAll('#taxonomy-filter input');
        for (const checkbox of checkboxes) {
            // The name of the checkbox is like 'tag:photography'
            const [taxonomy] = checkbox.name.split(':');
            // Remove category/tag from e.g. domain/blog/category:blog/tag:travel
            const regex = new RegExp(`\/${taxonomy}:[^\/]+`);
            pathname = pathname.replace(regex, '');
        }
        // Remove page:2 index
        pathname = pathname.replace(/\/page:\d+/, '');
        // Remove possible trailing slash
        return pathname.replace(/\/\//g, '/') || '/';
    }
    /**
     * Create url for current page with Taxonomy filters appended to it
     *
     * @param pathname Url to the page without Taxonomy filters
     * @returns Url with Taxonomy parameters, eg. "/tag:photograpy,city"
     */
    addTaxonomyFiltersToPathname(pathname) {
        const form = document.getElementById('taxonomy-filter');
        const formFields = new FormData(form);
        const taxonomies = {};
        for (const key of formFields.keys()) {
            let taxonomy, taxon;
            [taxonomy, taxon] = key.split(':');
            if (!taxonomies[taxonomy]) {
                taxonomies[taxonomy] = '';
            }
            taxonomies[taxonomy] += (taxonomies[taxonomy] ? `,${taxon}` : taxon);
        }
        let filters = '';
        for (const entry of Object.entries(taxonomies)) {
            filters += `/${entry[0]}:${entry[1]}`;
        }
        return (pathname + filters).replace(/\/\//g, '/');
    }
}
new TaxonomyFilter().initEventHandlers();
//# sourceMappingURL=taxonomy-filter.js.map
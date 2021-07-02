class TaxonomyFilter {

    /**
     * Create eventhandlers for 'Search' and 'Reset' buttons
     */
    initEventHandlers(): void {

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

            this.clearFields();
            const pathname = this.getCleanPathname();

            window.location.href = pathname;
        })
    }

    /**
     * Reset all checkboxes
     */
    clearFields(): void {
        const checkboxes = document.querySelectorAll('#taxonomy-filter input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

        for (const checkbox of checkboxes) {
            checkbox.checked = false;
        }

        document.getElementById('starts-after')?.setAttribute('value', '');
        document.getElementById('starts-before')?.setAttribute('value', '');
    }

    /**
     * Removes all Taxonomy filters (`/tag:photography`) and Pagination index (`/page:2`) from `document.location.pathname`.
     * 
     * @returns The url of the page without Taxonomy filters
     */
    getCleanPathname(): string {
        let pathname = document.location.pathname;

        // For every input field, remove it from the filters in the Url
        const checkboxes = document.querySelectorAll('#taxonomy-filter input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

        for (const checkbox of checkboxes) {
            // The name of the checkbox is like 'tag-photography'
            const [taxonomy] = checkbox.name.split('-');

            // Remove category/tag from e.g. domain/blog/category:blog/tag:travel
            const regex = new RegExp(`\/${taxonomy}:[^\/]+`);
            pathname = pathname.replace(regex, '');
        }

        // Remove date range
        pathname = pathname.replace(/(starts-after|ends-before):[^\/]+/g, '');

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
    addTaxonomyFiltersToPathname(pathname: string): string {
        const form = document.getElementById('taxonomy-filter') as HTMLFormElement;
        const formFields = new FormData(form);

        const fieldValues = {} as any;

        for (const key of formFields.keys()) {
            if (key.match(/(starts-after|ends-before)/)) {
                continue;
            }

            // let taxonomy, taxon;
            const [taxonomy, taxon] = key.split('-');

            if (!fieldValues[taxonomy]) {
                fieldValues[taxonomy] = '';
            }

            fieldValues[taxonomy] += (fieldValues[taxonomy] ? `,${taxon}` : taxon);
        }

        const startDate = formFields.get('starts-after');
        const endDate = formFields.get('ends-before');

        if (startDate) {
            fieldValues['starts-after'] = startDate;
        }

        if (endDate) {
            fieldValues['ends-before'] = endDate;
        }

        let params = '';

        for (const entry of Object.entries(fieldValues)) {
            params += `/${entry[0]}:${entry[1]}`;
        }

        return (pathname + params).replace(/\/\//g, '/');
    }
}

new TaxonomyFilter().initEventHandlers();
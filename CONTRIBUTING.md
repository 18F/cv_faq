# Welcome!

We're so glad you're thinking about contributing to a [open source project of the U.S. government](https://code.gov/)! If you're unsure about anything, just ask — or submit the issue or pull request anyway. The worst that can happen is you'll be politely asked to change something. We love all friendly contributions.

We encourage you to read this project's CONTRIBUTING policy (you are here), its [LICENSE](LICENSE.md), and its [README](README.md).

## Suggesting and reviewing changes

We use git branches and [pull requests](https://github.com/18F/cv_faq/pulls) to manage our development,  content update, and release process.

- All pull requests for content and code changes should be created off of, and targeting, the `dev` branch. The `dev` branch is our default development branch, and it should be kept stable with passing tests.

- All content and code changes must be reviewed by another person.

- Code changes should be reviewed by a dev team member, and content changes should be reviewed by a content team member.

- Content changes requiring additional review by a partner agency should, if possible, happen prior to merging into `dev`.[ Federalist preview links](https://federalist.18f.gov/documentation/previews/) may be shared with partners.

- Urgent code changes made outside of regular support hours may be merged without review by the engineer on-duty at their discretion.
  - The on-duty engineer may  choose to escalate and notify another engineer if they deem review necessary for a safe release to production.

- Use the [Federalist preview link](https://federalist.18f.gov/documentation/previews/) to preview the changes.


- Once a pull request is approved, either the reviewer or the author may merge into `dev`.

## Releasing and deploying changes

We use the `demo` (staging) and `master` branches for our pre-production and production environments, and use [pull requests](https://github.com/18F/cv_faq/pulls) to manage deployments.

- Only dev team members can release changes to pre-production and production environments.

- To initiate a production release, begin a release to staging. A dev team member opens a pull request from `dev` to `demo`, confirming the changes are as expected, following the checklist in the pull request template.

- The dev team member merges the pull request, and ensures the Federalist deployment to the staging environment completes successfully.

  - The dev team member confirms the changeset at [demo-er2epz2vb.18f.gov](https://demo-er2epz2vb.18f.gov/).

- Then, the dev team member opens a pull request from `demo` to `master`, confirming the changes are as expected, following the checklist in the pull request template.

- The dev team member merges the pull request, and ensures the Federalist deployment to the production environment completes successfully.

  - The dev team member confirms the changeset at [faq.coronavirus.gov](https://faq.coronavirus.gov/).
  
  - Changes may take up to 60 seconds to be visible in production due to caching in Federalist (Cloudfront).

A few additional notes:

- If a re-deploy is necessary, a dev team member can initiate a rebuild from [Federalist admin](https://federalistapp.18f.gov/sites/771/builds).

- The search index for the production environment is rebuilt automatically. Changes will be reflected in the search results within 30 minutes of release to production.


## Policies

We want to ensure a welcoming environment for all of our projects. Our staff follow the [TTS Code of Conduct](https://18f.gsa.gov/code-of-conduct/) and all contributors should do the same.

We adhere to the [18F Open Source Policy](https://github.com/18f/open-source-policy). If you have any questions, just [shoot us an email](mailto:18f@gsa.gov).

## Public domain

This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0 dedication. By submitting a pull request or issue, you are agreeing to comply with this waiver of copyright interest.

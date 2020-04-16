---
layout: default
permalink: /agency/
sitemap: false
---

{% assign agencies = site.agencies | sort: "name" %}
{% assign total = site.content %}

<section class="grid-container usa-section usa-section--condensed border-top border-base-lightest">
    <div class="grid-row">
      <div class="grid-col-12">
        <h1>All questions and answers by providing Agency ({{total | size}} total)</h1>
      </div>
    </div>
    <div class="grid-row">
        <div class="grid-col-12">
        {% for agency in agencies %}
            {% assign all = site.content | where:"source", agency.name %}
            {% assign categories = site.content | where:"source", agency.name | group_by:"category" %}
            <div>
                <h2><a href="{{ site.baseurl }}/agency/{{ agency.name}}/">{{agency.name}} ({{ all | size }} total)</a></h2>
                <ul>
                    {% for category in categories %}
                        {% assign current_category_questions = categories | where:"name", category.name | first %}
                        {% assign current_category = site.categories | where:"name", category.name | first %}
                        <li class="margin-bottom-2">
                            <a href="{{ site.baseurl }}/agency/{{ agency.name}}/#{{ current_category.title | slugify }}"
                               class="margin-y-1">{{ current_category.title }} ({{current_category_questions.items | size }})
                            </a>
                        </li>
                    {% endfor %}
                </ul>
            </div>
        {% endfor %}
        </div>
    </div>
</section>

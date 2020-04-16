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
            {% assign all_by_category = site.content | where:"source", agency.name | group_by:"category"  %}
            {% assign all_categories = site.categories | sort: "title" %}
            <div>
                <h2><a href="{{ site.baseurl }}{{ agency.url}}">{{agency.name}} ({{ all | size }} total)</a></h2>
                <ul>
                    {% for category in all_categories %}
                        {% assign current_category_questions = all_by_category | where:"name", category.name | first %}
                        {% if current_category_questions.size > 0 %}
                            <li class="margin-bottom-2">
                                <a href="{{ site.baseurl }}{{ agency.url}}#{{ category.title | slugify }}"
                                class="margin-y-1">{{ category.title }} ({{current_category_questions.items | size }})
                                </a>
                            </li>
                        {% endif %}
                    {% endfor %}
                </ul>
            </div>
        {% endfor %}
        </div>
    </div>
</section>

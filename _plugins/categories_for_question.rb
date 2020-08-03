module Jekyll
  module CategoriesForQuestion
    def for_question(categories, question_name)
      question_categories = []
      categories.each do |category|
        if category.data['questions'].include? question_name
          question_categories << category
        end
      end
      question_categories
    end
  end
end

Liquid::Template.register_filter(Jekyll::CategoriesForQuestion)

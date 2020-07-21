module Jekyll
  module CategoryQuestionsFilter
    def by_category(input, category_name, categories)
      questions = []
      categories.each do |category|
        if category.data['name'] == category_name
          input.each do |question|
            if question.data['categories'].include? category_name
              questions << question
            end
          end
        end
      end
      questions.sort! do |a, b|
        if a.promoted == b.promoted
          a.title <=> b.title
        elsif a.promoted
          -1
        elsif b.promoted
          1
        else
          0
        end
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::CategoryQuestionsFilter)

module Jekyll
  module QuestionLookupFilter
    def lookup_by_name(question_names, question_items)
      questions = []
      question_names.each do |question_name|
        question_items.each do |question_item|
          if question_item.basename_without_ext == question_name
            questions << question_item
          end
        end
      end
      questions
    end
  end
end

Liquid::Template.register_filter(Jekyll::QuestionLookupFilter)

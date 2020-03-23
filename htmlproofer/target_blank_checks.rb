class TargetBlankNoopener < ::HTMLProofer::Check

    def target_blank?
        return false if @link.data_proofer_ignore || @link.href.nil?
        return false if not @link.respond_to? :target
        @link.target.match '_blank'
      end

    def not_rel_noopener?
        return true if not @link.respond_to? :rel
        return true if not @link.rel.match 'noopener'
    end

    # Add issue if an <a> element has target="_blank" and NOT  rel="noopener"
    def run
      @html.css('a').each do |node|
        @link = create_element(node)

        line = node.line

        if target_blank? && not_rel_noopener?
          return add_issue("Links with target='_blank' must have rel='noopener'.", line: line)
        end
      end
    end
  end

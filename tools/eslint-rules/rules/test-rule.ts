/**
 * This file sets you up with with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */

 import {
	TmplAstContent,
	TmplAstElement,
	TmplAstTemplate,
} from '@angular/compiler';
import { ESLintUtils } from '@typescript-eslint/utils';
import {
	findComponents,
	getTemplateParserServices,
	isTmplAstElement,
} from '../utils/rule-utilities';

// NOTE: The rule will be available in ESLint configs as "@nrwl/nx/workspace/test-rule"
export const RULE_NAME = 'test-rule';

const criteria: string = 'cxui';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: ``,
      recommended: 'error',
    },
    schema: [],
    messages: {
			cxuiComponent: 'Located usage of {{element}}.',
    },
  },
  defaultOptions: [],
  create(context) {
		const parserServices = getTemplateParserServices(context);
		return {
			'Element$1, Template, Content'(
				node: TmplAstElement | TmplAstTemplate | TmplAstContent,
			) {
				let loc;
				if (isTmplAstElement(node)) {
					loc = parserServices.convertElementSourceSpanToLoc(context, node);
				} else {
					loc = parserServices.convertNodeSourceSpanToLoc(node.sourceSpan);
				}

				findComponents(node, criteria, false).forEach((n) => {
					context.report({
						loc,
						messageId: 'cxuiComponent',
						data: {
							element: n,
						},
					});
				});
			},
		};
  },
});

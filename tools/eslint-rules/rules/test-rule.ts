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
	getTemplateParserServices,
} from '../utils/rule-utilities';

// NOTE: The rule will be available in ESLint configs as "@nrwl/nx/workspace/test-rule"
export const RULE_NAME = 'test-rule';

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
      avoidTerse: "Avoid terse names"
    },
  },
  defaultOptions: [],
  create(context) {
		const parserServices = getTemplateParserServices(context);
    return {
      Identifier(node) {
        if (node.name.length < 2) {
          context.report({
            node,
            messageId: "avoidTerse"
          });
        }
      },
    };
  },
});

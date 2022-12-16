import { TSESLint } from '@typescript-eslint/utils';
import { rule, RULE_NAME } from './test-rule';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@angular-eslint/template-parser'),
});

ruleTester.run(RULE_NAME, rule, {
  valid: [`const example = true;`],
  invalid: [
    {
      code: `<button cxui-nada></button>`,
      errors: [{messageId: "cxuiComponent"}]
    }
  ],
});

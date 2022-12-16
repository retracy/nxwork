import { TSESLint } from '@typescript-eslint/utils';
import { rule, RULE_NAME } from './test-rule';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run(RULE_NAME, rule, {
  valid: [`const example = true;`],
  invalid: [
    {
      code: "var x = 0;",
      errors: [{messageId: "avoidTerse"}]
    }
  ],
});

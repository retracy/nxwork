import {
	TmplAstContent,
	TmplAstElement,
	TmplAstTemplate,
} from '@angular-eslint/bundled-angular-compiler';
import type { ParseSourceSpan, TmplAstNode } from '@angular/compiler';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

interface ParserServices {
	convertNodeSourceSpanToLoc: (
		sourceSpan: ParseSourceSpan,
	) => TSESTree.SourceLocation;
	convertElementSourceSpanToLoc: (
		context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
		node: TmplAstElement,
	) => TSESTree.SourceLocation;
}

export function getTemplateParserServices(
	context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
): ParserServices {
	const ps: ParserServices =
		context.parserServices as unknown as ParserServices;
	ensureTemplateParser(ps);
	return ps;
}

function ensureTemplateParser(parser: ParserServices) {
	if (
		!parser?.convertNodeSourceSpanToLoc ||
		!parser?.convertElementSourceSpanToLoc
	) {
		/**
		 * The user needs to have configured "parser" in their eslint config and set it
		 * to @angular-eslint/template-parser
		 */
		throw new Error(
			"You have used a rule which requires '@angular-eslint/template-parser' to be used as the 'parser' in your ESLint config.",
		);
	}
}

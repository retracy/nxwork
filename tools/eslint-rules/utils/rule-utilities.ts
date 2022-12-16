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


export function isTmplAstElement(node: TmplAstNode): node is TmplAstElement {
	return node instanceof TmplAstElement;
}

export function isTmplAstTemplate(node: TmplAstNode): node is TmplAstTemplate {
	return node instanceof TmplAstTemplate;
}

export function isTmplAstContent(node: TmplAstNode): node is TmplAstContent {
	return node instanceof TmplAstContent;
}

/**
 * A common helper for locating usages of a component directly as the node itself,
 * class attributes for styling, etc., inputs and/or outputs.
 */
export function findComponents(
	node: TmplAstElement | TmplAstTemplate | TmplAstContent,
	criteria: string,
	includeClassAttributes: boolean = true,
): string[] {
	const criteriaFunc = (inp) => inp.name.includes(criteria);
	let components: string[] = [];

	// A node could, in theory, contain multiple references to a component in the form
	// of the Element itself, Element or Template attributes, inputs and/or outputs so
	// all of these properties need to be assessed for any given node.
	if (isTmplAstElement(node) && node.name.includes(criteria)) {
		components.push(node.name);
	}

	let name: string;

	// If this is a template with structural directives then only look at the template
	// attributes. The other attributes will show up within child
	// elements of the template with further iteration of the AST
	if (isTmplAstTemplate(node) && node.templateAttrs.length > 0) {
		components.push(
			...node.templateAttrs.filter(criteriaFunc).map((m) => m.name),
		);
	} else {
		components.push(...node.attributes.filter(criteriaFunc).map((m) => m.name));

		// Since attributes that are in the form of key/value pairs and can contain several items in the value string,
		// these items are tokenized and returned separately, if they match the search criteria,
		// so that lint reporting references specific, single, references for each message.
		// This should make the post-processing on these messages easier as well.
		// Class attributes associated with styling are skipped for components such as cxui components but
		// are counted for legacy components to help facilitate code cleanup.
		if (includeClassAttributes) {
			components.push(
				...node.attributes
					.flatMap((a) => a.value.split(' '))
					.filter((v) => v.includes(criteria)),
			);
		}
	}

	// Only look at inputs/outputs for Element types.  Content nodes
	// don't contain inputs and outputs and Templates may contain
	// them but they will also show up under their child elements in
	// the tree.
	if (isTmplAstElement(node)) {
		name = node.inputs.find(criteriaFunc)?.name;
		if (name) components.push(name);

		name = node.outputs.find(criteriaFunc)?.name;
		if (name) components.push(name);
	}

	return components;
}

/**
 * Changes after this point: https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes#typescript-40
 */
import ts from "typescript";
import * as TsThreeEightModule from "../../declarations/typescript3";
import { TsTransformPathsContext } from "../../types";
import { DownSampleTsTypes } from "../utils";

/* ****************************************************************************************************************** */
// region: Mapping
/* ****************************************************************************************************************** */

export namespace TsThreeEight {
  export type TypeMap = [
    [ts.SourceFile, TsThreeEightModule.SourceFile],
    [ts.StringLiteral, TsThreeEightModule.StringLiteral],
    [ts.CompilerOptions, TsThreeEightModule.CompilerOptions],
    [ts.EmitResolver, TsThreeEightModule.EmitResolver],
    [ts.CallExpression, TsThreeEightModule.CallExpression],
    [ts.ExternalModuleReference, TsThreeEightModule.ExternalModuleReference],
    [ts.LiteralTypeNode, TsThreeEightModule.LiteralTypeNode],
    [ts.ExternalModuleReference, TsThreeEightModule.ExternalModuleReference],
    [ts.ImportTypeNode, TsThreeEightModule.ImportTypeNode],
    [ts.EntityName, TsThreeEightModule.EntityName],
    [ts.TypeNode, TsThreeEightModule.TypeNode],
    [readonly ts.TypeNode[], readonly TsThreeEightModule.TypeNode[]],
    [ts.LiteralTypeNode, TsThreeEightModule.LiteralTypeNode],
    [ts.ImportDeclaration, TsThreeEightModule.ImportDeclaration],
    [ts.ImportClause, TsThreeEightModule.ImportClause],
    [ts.Identifier, TsThreeEightModule.Identifier],
    [ts.NamedImportBindings, TsThreeEightModule.NamedImportBindings],
    [ts.ImportDeclaration, TsThreeEightModule.ImportDeclaration],
    [ts.ExportDeclaration, TsThreeEightModule.ExportDeclaration],
    [ts.ModuleDeclaration, TsThreeEightModule.ModuleDeclaration],
    [ts.Expression, TsThreeEightModule.Expression],
    [ts.ModuleBody, TsThreeEightModule.ModuleBody],
    [ts.ModuleName, TsThreeEightModule.ModuleName],
    [ts.ExportDeclaration["exportClause"], TsThreeEightModule.ExportDeclaration["exportClause"]]
  ];
}

// endregion

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

export namespace TsThreeEight {
  export const predicate = (context: TsTransformPathsContext) => context.tsVersionMajor < 4;

  export function handler(context: TsTransformPathsContext, prop: string | symbol) {
    const ts = context.tsInstance as unknown as typeof TsThreeEightModule;

    switch (prop) {
      case "updateCallExpression":
        return (...args: any) => ts.updateCall.apply(void 0, args);
      case "updateImportClause":
        return function (
          node: ts.ImportClause,
          isTypeOnly: boolean,
          name: ts.Identifier | undefined,
          namedBindings: ts.NamedImportBindings | undefined
        ) {
          return ts.updateImportClause.apply(void 0, downSample(node, name, namedBindings));
        };
      case "updateImportDeclaration":
        return function (
          node: ts.ImportDeclaration,
          modifiers: readonly ts.Modifier[] | undefined,
          importClause: ts.ImportClause | undefined,
          moduleSpecifier: ts.Expression
        ) {
          const [dsNode, dsImportClause, dsModuleSpecifier] = downSample(node, importClause, moduleSpecifier);

          return ts.updateImportDeclaration(
            dsNode,
            dsNode.decorators,
            dsNode.modifiers,
            dsImportClause,
            dsModuleSpecifier
          );
        };
      case "updateExportDeclaration":
        return function (
          node: ts.ExportDeclaration,
          modifiers: readonly ts.Modifier[] | undefined,
          isTypeOnly: boolean,
          exportClause: ts.NamedExportBindings | undefined,
          moduleSpecifier: ts.Expression | undefined
        ) {
          const [dsNode, dsModuleSpecifier, dsExportClause] = downSample(node, moduleSpecifier, exportClause);
          return ts.updateExportDeclaration(
            dsNode,
            dsNode.decorators,
            dsNode.modifiers,
            dsExportClause,
            dsModuleSpecifier,
            // @ts-ignore - This was added in later versions of 3.x
            dsNode.isTypeOnly
          );
        };
      case "updateModuleDeclaration":
        return function (
          node: ts.ModuleDeclaration,
          modifiers: readonly ts.Modifier[] | undefined,
          name: ts.ModuleName,
          body: ts.ModuleBody | undefined
        ) {
          const [dsNode, dsName, dsBody] = downSample(node, name, body);

          return ts.updateModuleDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsName, dsBody);
        };
      case "updateImportTypeNode":
        return function (
          node: ts.ImportTypeNode,
          argument: ts.TypeNode,
          assertions: ts.ImportTypeAssertionContainer | undefined,
          qualifier: ts.EntityName | undefined,
          typeArguments: readonly ts.TypeNode[] | undefined,
          isTypeOf?: boolean
        ) {
          const [dsNode, dsArgument, dsQualifier, dsTypeArguments] = downSample(
            node,
            argument,
            qualifier,
            typeArguments
          );

          return ts.updateImportTypeNode(dsNode, dsArgument, dsQualifier, dsTypeArguments, isTypeOf);
        };
      default:
        return (...args: any) => (<any>ts)[prop](...args);
    }
  }

  export function downSample<T extends [...unknown[]]>(...args: T): DownSampleTsTypes<TypeMap, T> {
    return <any>args;
  }
}

// endregion

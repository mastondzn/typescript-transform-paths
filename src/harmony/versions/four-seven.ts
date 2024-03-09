/**
 * Changes after this point: https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes#typescript-48
 */
import ts from "typescript";
import TsFourSevenModule from "../../declarations/typescript4.7";
import { TsTransformPathsContext } from "../../types";
import { DownSampleTsTypes } from "../utils";

/* ****************************************************************************************************************** */
// region: Mapping
/* ****************************************************************************************************************** */

export namespace TsFourSeven {
  export type TypeMap = [
    [ts.ImportDeclaration, TsFourSevenModule.ImportDeclaration],
    [ts.Modifier, TsFourSevenModule.Modifier],
    [ts.ImportClause, TsFourSevenModule.ImportClause],
    [ts.Expression, TsFourSevenModule.Expression],
    [ts.AssertClause, TsFourSevenModule.AssertClause],
    [ts.ExportDeclaration, TsFourSevenModule.ExportDeclaration],
    [ts.NamedExportBindings, TsFourSevenModule.NamedExportBindings],
    [ts.ModuleDeclaration, TsFourSevenModule.ModuleDeclaration],
    [ts.ModuleName, TsFourSevenModule.ModuleName],
    [ts.ModuleBody, TsFourSevenModule.ModuleBody]
  ];
}

// endregion

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

export namespace TsFourSeven {
  export const predicate = ({ tsVersionMajor, tsVersionMinor }: TsTransformPathsContext) =>
    tsVersionMajor == 4 && tsVersionMinor < 8;

  export function handler(context: TsTransformPathsContext, prop: string | symbol) {
    const factory = context.tsFactory as unknown as TsFourSevenModule.NodeFactory;

    switch (prop) {
      case "updateImportDeclaration":
        return function (
          node: ts.ImportDeclaration,
          modifiers: readonly ts.Modifier[] | undefined,
          importClause: ts.ImportClause | undefined,
          moduleSpecifier: ts.Expression,
          assertClause: ts.AssertClause | undefined
        ) {
          const [dsNode, dsImportClause, dsModuleSpecifier, dsAssertClause] = downSample(
            node,
            importClause,
            moduleSpecifier,
            assertClause
          );

          return factory.updateImportDeclaration(
            dsNode,
            dsNode.decorators,
            dsNode.modifiers,
            dsImportClause,
            dsModuleSpecifier,
            dsAssertClause
          );
        };
      case "updateExportDeclaration":
        return function (
          node: ts.ExportDeclaration,
          modifiers: readonly ts.Modifier[] | undefined,
          isTypeOnly: boolean,
          exportClause: ts.NamedExportBindings | undefined,
          moduleSpecifier: ts.Expression | undefined,
          assertClause: ts.AssertClause | undefined
        ) {
          const [dsNode, dsExportClause, dsModuleSpecifier, dsAssertClause] = downSample(
            node,
            exportClause,
            moduleSpecifier,
            assertClause
          );

          return factory.updateExportDeclaration(
            dsNode,
            dsNode.decorators,
            dsNode.modifiers,
            isTypeOnly,
            dsExportClause,
            dsModuleSpecifier,
            dsAssertClause
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

          return factory.updateModuleDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsName, dsBody);
        };
      default:
        return (...args: any) => (<any>factory)[prop](...args);
    }
  }

  export function downSample<T extends [...unknown[]]>(...args: T): DownSampleTsTypes<TypeMap, T> {
    return <any>args;
  }
}

// endregion

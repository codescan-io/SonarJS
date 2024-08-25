/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

export const ruleDefaults: Record<string, any> = {
  S100: [{ format: '^[_a-z][a-zA-Z0-9]*$' }],
  S101: [{ format: '^[A-Z][a-zA-Z0-9]*$' }],
  S103: [{ code: 180, tabWidth: 1 }],
  S104: [{ maximum: 1000 }],
  S106: [
    {
      allow: [
        'assert',
        'clear',
        'count',
        'group',
        'groupCollapsed',
        'groupEnd',
        'info',
        'table',
        'time',
        'timeEnd',
        'trace',
      ],
    },
  ],
  S107: [{ max: 7 }],
  S108: [{ allowEmptyCatch: true }],
  S109: [
    {
      ignore: [0, 1, -1, 24, 60],
      ignoreEnums: true,
      ignoreReadonlyClassProperties: true,
      ignoreNumericLiteralTypes: true,
      ignoreDefaultValues: true,
      ignoreClassFieldInitialValues: true,
    },
  ],
  S113: ['always'],
  S117: [{ format: '^[_$A-Za-z][$A-Za-z0-9]*$|^[_$A-Z][_$A-Z0-9]+$' }],
  S124: [
    { regularExpression: '', message: 'The regular expression matches this comment.', flags: '' },
  ],
  S134: [{ maximumNestingLevel: 3 }],
  S138: [{ maximum: 200 }],
  S139: [{ ignorePattern: '^\\s*[^\\s]+$' }],
  S905: [
    {
      allowShortCircuit: true,
      allowTaggedTemplates: true,
      allowTernary: true,
      enforceForJSX: true,
    },
  ],
  S1067: [{ max: 3 }],
  S1105: ['1tbs', { allowSingleLine: true }],
  S1117: [{ hoist: 'all' }],
  S1186: [{ allow: ['arrowFunctions', 'constructors', 'private-constructors'] }],
  S1192: [{ threshold: 3, ignoreStrings: 'application/json' }],
  S1440: ['smart'],
  S1441: ['single', { avoidEscape: true, allowTemplateLiterals: true }],
  S1451: [{ headerFormat: '', isRegularExpression: false }],
  S1479: [30],
  S1539: ['never'],
  S1541: [{ threshold: 10 }],
  S2004: [{ threshold: 4 }],
  S2068: [{ credentialWords: ['password', 'pwd', 'passwd'] }],
  S2094: [
    {
      allowConstructorOnly: false,
      allowEmpty: false,
      allowStaticOnly: true,
      allowWithDecorator: true,
    },
  ],
  S2376: [{ getWithoutSet: false }],
  S2430: [{ newIsCap: true, capIsNew: false, properties: false }],
  S2814: [{ builtinGlobals: false, ignoreDeclarationMerge: true }],
  S2999: [{ considerJSDoc: false }],
  S3353: [{ destructuring: 'all' }],
  S3524: [{ requireParameterParentheses: false, requireBodyBraces: false }],
  S3723: ['always-multiline'],
  S3776: [15],
  S4023: [{ allowSingleExtends: true }],
  S4137: [{ assertionStyle: 'as', objectLiteralTypeAssertions: 'allow' }],
  S4144: [3],
  S4327: [{ allowDestructuring: true }],
  S4328: [{ whitelist: [''] }],
  S4622: [{ threshold: 3 }],
  S5604: [{ permissions: ['geolocation'] }],
  S5693: [{ fileUploadSizeLimit: 8000000, standardSizeLimit: 2000000 }],
  S5843: [{ threshold: 20 }],
  S6480: [{ ignoreRefs: true, ignoreDOMComponents: true }],
  S6544: [{ ignoreIIFE: true, checksVoidReturn: { attributes: false, arguments: false } }],
  S6550: [{ allowBitwiseExpressions: false }],
  S6606: [
    {
      ignoreConditionalTests: true,
      ignoreTernaryTests: false,
      ignoreMixedLogicalExpressions: true,
      allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true,
    },
  ],
  S6644: [{ defaultAssignment: false }],
  S6747: [{ ignore: [''] }],
  S6749: [{ allowExpressions: true }],
  S6754: [{ allowDestructuredState: true }],
  S6766: [{ forbid: ['\u003e', '}'] }],
  S6791: [{ checkAliases: true }],
  S6821: [{ ignoreNonDOM: true, allowedInvalidRoles: ['text'] }],
};

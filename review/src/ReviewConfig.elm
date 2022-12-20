module ReviewConfig exposing (config)

{-| Do not rename the ReviewConfig module or the config function, because
`elm-review` will look for these.

To add packages that contain rules, add them to this review project using

    `elm install author/packagename`

when inside the directory containing this file.

-}

import Docs.NoMissing
import Docs.ReviewAtDocs
import Docs.ReviewLinksAndSections
import Docs.UpToDateReadmeLinks
import NoAlways
import NoBooleanCase
import NoConfusingPrefixOperator
import NoDebug.Log
import NoDebug.TodoOrToString
import NoDeprecated
import NoDuplicatePorts
import NoExposingEverything
import NoForbiddenWords
import NoFunctionOutsideOfModules
import NoImportingEverything
import NoInconsistentAliases
import NoLeftPizza
import NoMissingSubscriptionsCall
import NoMissingTypeAnnotation
import NoMissingTypeAnnotationInLetIn
import NoMissingTypeExpose
import NoModuleOnExposedNames
import NoPrematureLetComputation
import NoPrimitiveTypeAlias
import NoRecursiveUpdate
import NoRedundantConcat
import NoRedundantCons
import NoSimpleLetBody
import NoSinglePatternCase
import NoTestValuesInProductionCode
import NoTypeAliasConstructorCall
import NoUnmatchedUnit
import NoUnnecessaryTrailingUnderscore
import NoUnoptimizedRecursion
import NoUnsafeDivision
import NoUnsafePorts
import NoUnsortedCases
import NoUnsortedRecords
import NoUnused.CustomTypeConstructorArgs
import NoUnused.CustomTypeConstructors
import NoUnused.Dependencies
import NoUnused.Exports
import NoUnused.Parameters
import NoUnused.Patterns
import NoUnusedPorts
import Review.Rule as Rule exposing (Rule)
import Simplify
import UseCamelCase
import UseMemoizedLazyLambda


config : List Rule
config =
    [ NoDebug.Log.rule
    , NoDebug.TodoOrToString.rule
    , NoUnused.CustomTypeConstructors.rule []
    , NoUnused.CustomTypeConstructorArgs.rule
    , NoUnused.Dependencies.rule
    , NoUnused.Exports.rule
        |> Rule.ignoreErrorsForFiles [ "src/View.elm" ]
    , NoUnused.Parameters.rule
    , NoUnused.Patterns.rule
    , NoExposingEverything.rule
    , NoImportingEverything.rule []
    , NoMissingTypeAnnotation.rule
    , NoSimpleLetBody.rule
    , NoDeprecated.rule NoDeprecated.defaults
    , NoMissingTypeAnnotation.rule
    , NoMissingTypeAnnotationInLetIn.rule
    , NoMissingTypeExpose.rule
    , NoPrematureLetComputation.rule
    , NoUnoptimizedRecursion.rule (NoUnoptimizedRecursion.optOutWithComment "IGNORE RECURSE")
    , Simplify.rule Simplify.defaults
    , NoTestValuesInProductionCode.rule
        (NoTestValuesInProductionCode.startsWith "test_")
    , NoMissingSubscriptionsCall.rule
    , NoRecursiveUpdate.rule
    , NoUnmatchedUnit.rule
    , NoAlways.rule
    , NoInconsistentAliases.config
        [ ( "Browser.Navigation", "Nav" )
        , ( "Page.About", "About" )
        , ( "Page.Donate", "Donate" )
        , ( "Page.Feedback", "Feedback" )
        , ( "Page.Index", "Home" )
        , ( "Page.Legal", "Legal" )
        , ( "Page.News", "News" )
        , ( "Page.Offers", "Offers" )
        , ( "Page.Sitemap", "Sitemap" )
        , ( "Accessibility.Styled", "Html" )
        , ( "Accessibility.Styled.Aria", "Aria" )
        , ( "Accessibility.Styled.Role", "Role" )
        , ( "Html.Styled.Attributes", "Attr" )
        , ( "Html.Styled.Lazy", "Lazy" )
        , ( "Html.Styled.Events", "Events" )
        , ( "Url.Parser", "Parser" )
        , ( "Json.Decode", "Decode" )
        , ( "Json.Encode", "Encode" )
        , ( "Json.Decode.Pipeline", "Pipeline" )
        , ( "Test.Html.Event", "Event" )
        , ( "Test.Html.Query", "Query" )
        , ( "Browser.Dom", "Dom" )
        , ( "LanguageTag.Country", "Country" )
        , ( "LanguageTag.Language", "Language" )
        , ( "LanguageTag.Script", "Script" )
        , ( "LanguageTag.Variant", "Variant" )
        , ( "Pages.Manifest", "Manifest" )
        , ( "Head.Seo", "Seo" )
        , ( "Css.Media", "Media" )
        , ( "Css.Transitions", "Transitions" )
        ]
        |> NoInconsistentAliases.noMissingAliases
        |> NoInconsistentAliases.rule
        |> Rule.ignoreErrorsForFiles [ "src/Styles.elm", "src/Shared.elm" ]
        |> Rule.ignoreErrorsForDirectories [ "tests/" ]
    , NoModuleOnExposedNames.rule
    , UseCamelCase.rule UseCamelCase.default
    , NoDuplicatePorts.rule
    , NoUnsafePorts.rule NoUnsafePorts.any
    , NoUnusedPorts.rule
    , NoPrimitiveTypeAlias.rule
    , Docs.UpToDateReadmeLinks.rule
    , Docs.ReviewAtDocs.rule
    , Docs.ReviewLinksAndSections.rule
    , Docs.NoMissing.rule
        { document = Docs.NoMissing.onlyExposed
        , from = Docs.NoMissing.allModules
        }
        |> Rule.ignoreErrorsForDirectories [ "tests/", "src/Page/" ]
    , UseMemoizedLazyLambda.rule
    , NoUnnecessaryTrailingUnderscore.rule
    , NoConfusingPrefixOperator.rule
    , NoFunctionOutsideOfModules.rule
        [ ( [ "Css.hex"
            , "Css.hsl"
            , "Css.hsla"
            , "Css.rgb"
            , "Css.rgba"
            ]
          , [ "Colors" ]
          )
        , ( [ "Accessibility.Styled.styled" ]
          , [ "Styles" ]
          )
        ]
    , NoBooleanCase.rule
    , NoRedundantConcat.rule
    , NoRedundantCons.rule
    , NoLeftPizza.rule NoLeftPizza.Any
        |> Rule.ignoreErrorsForDirectories [ "tests/" ]
    , NoTypeAliasConstructorCall.rule
    , NoUnsafeDivision.rule
    , NoUnsortedCases.rule NoUnsortedCases.defaults
    , NoSinglePatternCase.rule
        NoSinglePatternCase.fixInArgument
    , NoUnsortedRecords.rule
        (NoUnsortedRecords.defaults
            |> NoUnsortedRecords.doNotSortAmbiguousRecords
            |> NoUnsortedRecords.doNotSortUnknownRecords
        )
    , NoForbiddenWords.rule [ "- [ ]", "- [x]" ]
    ]
        |> List.map (Rule.ignoreErrorsForDirectories [ ".elm-pages/" ])

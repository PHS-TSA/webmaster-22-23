module ReviewConfig exposing (config)

{-| Do not rename the ReviewConfig module or the config function, because
`elm-review` will look for these.

To add packages that contain rules, add them to this review project using

    `elm install author/packagename`

when inside the directory containing this file.

-}

import CognitiveComplexity
import NoUnapprovedLicense
import Review.Rule as Rule exposing (Rule)


config : List Rule
config =
    [ CognitiveComplexity.rule 15
    , NoUnapprovedLicense.rule
        { allowed =
            [ "BSD-3-Clause"
            , "MIT"
            ]
        , forbidden = []
        }
    ]
    |> List.map (Rule.ignoreErrorsForDirectories [ ".elm-pages/" ])

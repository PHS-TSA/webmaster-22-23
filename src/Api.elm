module Api exposing (routes)

import Accessibility.Styled as Html exposing (Html)
import ApiRoute
import DataSource exposing (DataSource)
import Route exposing (Route)


routes :
    DataSource (List Route)
    -> (Html Never -> String)
    -> List (ApiRoute.ApiRoute ApiRoute.Response)
routes getStaticRoutes htmlToString =
    []

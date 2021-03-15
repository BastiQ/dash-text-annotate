
module DashTextAnnotate
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.1"

include("'dta'_dashtextannotate.jl")
include("'dta'_examplecomponent.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_text_annotate",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "dash_text_annotate.min.js",
    external_url = "https://unpkg.com/dash_text_annotate@0.0.1/dash_text_annotate/dash_text_annotate.min.js",
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_text_annotate.min.js.map",
    external_url = "https://unpkg.com/dash_text_annotate@0.0.1/dash_text_annotate/dash_text_annotate.min.js.map",
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end

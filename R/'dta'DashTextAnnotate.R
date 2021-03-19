# AUTO GENERATED FILE - DO NOT EDIT

'dta'DashTextAnnotate <- function(id=NULL, text=NULL, entities=NULL, tag=NULL, tag_colors=NULL) {
    
    props <- list(id=id, text=text, entities=entities, tag=tag, tag_colors=tag_colors)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DashTextAnnotate',
        namespace = 'dash_text_annotate',
        propNames = c('id', 'text', 'entities', 'tag', 'tag_colors'),
        package = 'dashTextAnnotate'
        )

    structure(component, class = c('dash_component', 'list'))
}

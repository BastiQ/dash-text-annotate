% Auto-generated: do not edit by hand
\name{'dta'DashTextAnnotate}

\alias{'dta'DashTextAnnotate}

\title{DashTextAnnotate component}

\description{
Learnings: Don't try to print (<p>..) lists or dictionaries directly
}

\usage{
'dta'DashTextAnnotate(id=NULL, text=NULL, entities=NULL, tag=NULL, tag_color=NULL)
}

\arguments{
\item{id}{Character. The ID used to identify this component in Dash callbacks.}

\item{text}{Character. The text that should be annotated}

\item{entities}{Unnamed list. The entities that are currently available}

\item{tag}{Character. The currently selected tag (e.g. DATE) with which the selections will be tagged. This must be managed by the Dash App.}

\item{tag_color}{Character. The currently selected tag color (e.g. GREEN) with which the selected tag will be colored. This must be managed by the Dash App.}
}

\value{named list of JSON elements corresponding to React.js properties and their values}


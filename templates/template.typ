#import sys: inputs

#set page(paper: "a4")
#set text(font: inputs.font, 11pt)

#text(size: 14pt)[#align(center)[*#inputs.title*]]

Date: #inputs.date

#v(1em)

#for item in inputs.sections [
  #item.title

  #item.content
  #v(1em)
]

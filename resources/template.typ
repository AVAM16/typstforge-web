#import sys: inputs

#set page(paper: "a4")
#set text(font: "TeX Gyre Cursor", 11pt)

Title: #inputs.title

Date: #inputs.date

#v(1em)

#for item in inputs.sections [
  #item.title

  #item.content
  #v(1em)
]

#import sys: inputs

#set page(paper: "a4", margin: 2cm)
#set text(font: inputs.font, size: inputs.font_size * 1pt)

// Title
#align(center)[
  *#inputs.title*
]

#v(0.5em)

// Date
Date: _ #inputs.date _

#v(1.5em)

// Sections
#for item in inputs.sections [
  #item.title

  #item.content

  #v(1em)
]

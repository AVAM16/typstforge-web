#import sys: inputs

#set page(paper: "a4", margin: 2cm)
#set text(
  font: if inputs.at("font", default: none) != none { inputs.font } else { "FreeSans" },
  size: if inputs.at("font_size", default: none) != none { inputs.font_size * 1pt } else { 11pt },
)

// Title
#align(center)[
  = #inputs.title
]

#v(0.5em)

// Date
Date: _ #inputs.date _

#v(1.5em)

// Sections
#for item in inputs.sections [
  #if item.title.len() > 0 [
    == #item.title
  ]

  #if item.content.len() > 0 [
    #eval(item.content, mode: "markup")
  ]

  #if item.at("image_data", default: none) != none [
    #align(center)[
      #image.decode(bytes(item.image_data.map(int)), width: item.at("image_width_percent", default: 40) * 1%)
    ]
  ]

  #v(1em)
]

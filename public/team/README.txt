Drop transparent-background PNGs of your board members here, e.g. aditya.png
Then set the `img` field in src/data/content.js -> team.members, for example:
  { name: 'Aditya Singh', role: 'Chairperson', initials: 'AS', img: '/team/aditya.png' }
If `img` is omitted, a bg-less neon badge with initials is shown instead.

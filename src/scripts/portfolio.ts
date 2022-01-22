//
// definitions for Portfolio data
//

// Project group
export interface PortfolioGroup {
  readonly title: string;
  readonly name: string;
}

// Project in portfolio
export class PortfolioProject {
  readonly group: PortfolioGroup;
  readonly title: string;
  readonly name: string;
  readonly description: string;
  readonly numberOfPhoto: number;
  readonly ext: string;

  constructor(
    group: PortfolioGroup,
    title: string,
    name: string,
    description: string,
    numberOfPhoto: number,
    ext?: string
  ) {
    this.group = group;
    this.title = title;
    this.name = name;
    this.description = description;
    this.numberOfPhoto = numberOfPhoto;
    this.ext = ext ?? "jpg";
  }

  // Get photo file URL at the specified index
  photoFileUrl(index: number): string {
    return `${process.env.BASE_URL}image/${this.group.name}/${this.name}/${(
      "00" + `${index}`
    ).slice(-3)}.${this.ext}`;
  }

  altText(index: number): string {
    return `${this.group.title} ${this.title} number ${index}`;
  }

  // Get Cover photo URL
  coverFileUrl(): string {
    return `${process.env.BASE_URL}image/${this.group.name}/${this.name}/top.jpg`;
  }

  // Get Background photo URL
  backgroundUrl(): string {
    return `${process.env.BASE_URL}image/${this.group.name}/${this.name}/background.jpg`;
  }
}

// Group definition
const craneGroup = { title: "japanese crane", name: "crane" };
const lightGroup = { title: "light", name: "light" };

// project list
export const portfolioProjects: PortfolioProject[] = [
  new PortfolioProject(
    craneGroup,
    "memories",
    "memories",
    "Memories of the early childhood days with parents",
    26
  ),
  new PortfolioProject(
    craneGroup,
    "love",
    "love",
    "Love expressed in majestic nature scenes through all the seasons",
    23
  ),
  new PortfolioProject(
    craneGroup,
    "garden of deity",
    "garden",
    "Gardens the marsh deity lives",
    16
  ),
  new PortfolioProject(
    craneGroup,
    "path",
    "path",
    "Inspiration from 'Road' by Kaii HIGASHIYAMA",
    22
  ),
  new PortfolioProject(
    craneGroup,
    "wabi sabi",
    "wabisabi",

    "The aesthetic sensibility as Japanese - the beauty in simplicity and imperfection",
    16
  ),
  //{ title: "night and dawn", name: "nightdawn", numberOfPhoto: 1 },
  new PortfolioProject(
    craneGroup,
    "shiratama-chan",
    "shiratama",
    "Admirable, cute, and brave",
    16
  ),
  new PortfolioProject(
    lightGroup,
    "in forest",
    "forest",
    "Faint but strong lights in forest",
    22,
    "webp"
  ),
  new PortfolioProject(
    lightGroup,
    "on river",
    "river",
    "Lights on river sparkling the life",
    8,
    "webp"
  )
];
export default portfolioProjects;

// Empty project
export const emptyProject: PortfolioProject = new PortfolioProject(
  { title: "", name: "" },
  "",
  "",
  "",
  0
);

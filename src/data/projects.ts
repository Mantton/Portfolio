export type ProjectMetric = {
  value: string;
  suffix?: string;
  label: string;
  wide?: boolean;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  tags: string[];
  goldTags: string[];
  descriptionHtml: string;
  stackLines: string[];
  featured?: boolean;
  metrics?: ProjectMetric[];
  links: ProjectLink[];
  visual: "suwatte" | "taro";
};

export type CodeSample = {
  id: string;
  label: string;
  filename: string;
  code: string;
};

export type ScreenshotSource = {
  src: string;
  type: "image/jpeg";
  width: number;
};

export type Screenshot = {
  src: string;
  width: number;
  height: number;
  sources: ScreenshotSource[];
  caption: string;
  alt: string;
};

const screenshotWidths = [240, 360, 607] as const;

function screenshotSources(slug: string): ScreenshotSource[] {
  return screenshotWidths.map((width) => ({
    src: `/screenshots/responsive/suwatte-${slug}-${width}.jpg`,
    type: "image/jpeg",
    width,
  }));
}

export const suwatteScreenshots: Screenshot[] = [
  {
    src: "/screenshots/suwatte-home.png",
    width: 607,
    height: 1320,
    sources: screenshotSources("home"),
    caption: "01 · Home",
    alt: "Suwatte home screenshot",
  },
  {
    src: "/screenshots/suwatte-library.png",
    width: 607,
    height: 1320,
    sources: screenshotSources("library"),
    caption: "02 · Library",
    alt: "Suwatte library screenshot",
  },
  {
    src: "/screenshots/suwatte-collection.png",
    width: 607,
    height: 1320,
    sources: screenshotSources("collection"),
    caption: "03 · Local Library",
    alt: "Suwatte local library collection screenshot",
  },
  {
    src: "/screenshots/suwatte-reader.png",
    width: 607,
    height: 1320,
    sources: screenshotSources("reader"),
    caption: "04 · Reader",
    alt: "Suwatte reader screenshot",
  },
  {
    src: "/screenshots/suwatte-sources.png",
    width: 607,
    height: 1320,
    sources: screenshotSources("sources"),
    caption: "05 · Sources",
    alt: "Suwatte sources screenshot",
  },
  {
    src: "/screenshots/suwatte-history.png",
    width: 607,
    height: 1320,
    sources: screenshotSources("history"),
    caption: "06 · History",
    alt: "Suwatte history screenshot",
  },
];

export const projects: Project[] = [
  {
    slug: "suwatte",
    number: "01",
    title: "Suwatte",
    subtitle: "2022 — Present · Maintained",
    featured: true,
    visual: "suwatte",
    goldTags: ["★ Featured"],
    tags: ["iOS", "SwiftUI", "UIKit", "CoreData"],
    descriptionHtml:
      "Suwatte is a <strong>feature-rich iOS manga & comic reader</strong> built around extensible sources, local library management, offline downloads, and reading progress that <strong>syncs across devices</strong>. It focuses on giving power readers a fast, organized, and flexible way to discover, manage, and read their collection across <strong>local and source-based content</strong>.",
    stackLines: [
      "Swift · TypeScript",
      "JavaScriptCore · WebKit",
      "CloudKit · CoreData",
      "Firebase",
    ],
    metrics: [
      { value: "10K", suffix: "+", label: "TestFlight Downloads" },
      { value: "3,200", suffix: "+", label: "MAU" },
      { value: "6", suffix: "hrs/wk", label: "Avg. Engagement", wide: true },
    ],
    links: [
      { label: "Github ↗", href: "https://github.com/Suwatte/Suwatte" },
      { label: "Website ↗", href: "https://suwatte.mantton.com" },
      {
        label: "TestFlight ↗",
        href: "https://testflight.apple.com/join/8JYvZH1n",
      },
    ],
  },
  {
    slug: "taro",
    number: "02",
    title: "Taro",
    subtitle: "2024 — Present · Experimental",
    visual: "taro",
    goldTags: ["Programming Language", "Compiler"],
    tags: ["Rust", "LLVM", "Type Systems"],
    descriptionHtml:
      "Taro is an <strong>experimental, statically typed programming language</strong> inspired by Rust, Swift, and Go. It combines type inference, algebraic data types, pattern matching, interfaces, and automatic garbage collection with a compiler written in Rust, an LLVM 16 backend, a custom runtime, standard library, package tooling, CLI, LSP, and editor integrations.",
    stackLines: [
      "Rust · LLVM · Inkwell",
      "Bidirectional TypeChecking · Codegen",
      "Garbage Collection · Runtime",
    ],
    links: [
      { label: "Github ↗", href: "https://github.com/Mantton/Taro" },
      {
        label: "Examples ↗",
        href: "https://github.com/Mantton/Taro/tree/main/examples",
      },
      {
        label: "Docs ↗",
        href: "https://github.com/Mantton/Taro/tree/main/docs",
      },
    ],
  },
];

export const taroCodeSamples: CodeSample[] = [
  {
    id: "scorecard",
    label: "01 · Structs",
    filename: "scorecard.tr",
    code: `struct ScoreCard {
  readonly player: string
  wins: int32
  losses: int32
}

impl ScoreCard {
  func new(player: string) -> Self {
    ScoreCard { player, wins: 0, losses: 0 }
  }

  // Computed property — chooses receiver effect
  var games: int32 {
    get(&self) { self.wins + self.losses }
  };

  func recordWin(&mut self) {
    self.wins += 1
  }
}`,
  },
  {
    id: "command",
    label: "02 · Enums & Matching",
    filename: "command.tr",
    code: `enum Command {
  case quit
  case move(int32, int32)
  case resize(int32, int32)
  case write(string)
}

func describe(_ command: Command) -> string {
  match command {
    // Or-patterns share extracted bindings.
    case .move(x, y) | .resize(x, y) => "vector command"

    // Guards keep validation close to the pattern.
    case .write(text) if text.isEmpty() => "empty message"
    case .write(text) => text
    case .quit       => "shutdown"
  }
}`,
  },
  {
    id: "cache",
    label: "03 · Generics",
    filename: "cache.tr",
    code: `import std.hash.Hashable

struct InlineCache[Key: Hashable, Value, const Capacity: usize = 8] {
  keys: [Key?; Capacity]
  values: [Value?; Capacity]
}

func slots[Key: Hashable, Value, const Capacity: usize](
  _ cache: &InlineCache[Key, Value, Capacity],
) -> usize {
  let _ = cache
  Capacity
}

func valueOrElse[T](_ value: T?, _ fallback: T) -> T {
  match value {
    case .some(v) => v
    case .none    => fallback
  }
}`,
  },
  {
    id: "badge",
    label: "04 · Interfaces",
    filename: "badge.tr",
    code: `interface Identified {
  func id(&self) -> usize
}

interface Named {
  func name(&self) -> string

  // Default methods inherit on conformance.
  func display(&self) -> string {
    "@" + self.name()
  }
}

struct UserBadge {
  id: usize
  name: string
}

impl Identified for UserBadge {
  func id(&self) -> usize { self.id }
}

impl Named for UserBadge {
  func name(&self) -> string { self.name }
}

func openProfile(_ value: any Identified & Named) -> string {
  value.display()
}`,
  },
];

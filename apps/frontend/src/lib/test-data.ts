export interface TestProduct {
  id: number;
  title: string;
  artist: string;
  artistId: number;
  price: number;
  category: string;
  emoji: string;
  isNew: boolean;
  description: string;
}

export interface TestArtist {
  id: number;
  name: string;
  specialty: string;
  works: number;
  emoji: string;
  acceptingCommissions: boolean;
  bio: string;
}

export const TEST_PRODUCTS: TestProduct[] = [
  {
    id: 1,
    title: 'フェンリル・ウォーリアー フィギュア',
    artist: 'テスト作家A',
    artistId: 1,
    price: 4800,
    category: 'フィギュア',
    emoji: '🐺',
    isNew: true,
    description:
      'ケモノ系フィギュアのサンプルデータです。精密造形にこだわった1/8スケールフィギュア。',
  },
  {
    id: 2,
    title: '夕焼け狐耳少女 イラスト',
    artist: 'テスト作家B',
    artistId: 2,
    price: 1200,
    category: 'イラスト',
    emoji: '🦊',
    isNew: true,
    description: '夕焼けを背景にした狐耳少女のデジタルイラスト。高解像度PNG・PSD形式で配布。',
  },
  {
    id: 3,
    title: 'ケモノキャラクター アクリルスタンド',
    artist: 'テスト作家A',
    artistId: 1,
    price: 1800,
    category: 'アクリルスタンド',
    emoji: '✨',
    isNew: false,
    description: 'オリジナルケモノキャラのアクリルスタンドセット（3種）。',
  },
  {
    id: 4,
    title: '獣人世界の物語 第一巻',
    artist: 'テスト作家C',
    artistId: 3,
    price: 800,
    category: '書籍',
    emoji: '📖',
    isNew: true,
    description: '獣人世界を舞台にしたファンタジー小説。PDF・EPUB形式で配布。全200ページ。',
  },
  {
    id: 5,
    title: 'モフモフ狼 ぬいぐるみ',
    artist: 'テスト作家B',
    artistId: 2,
    price: 3200,
    category: 'ぬいぐるみ',
    emoji: '🐻',
    isNew: false,
    description: '手作りのもふもふ狼ぬいぐるみ。高さ約20cm。受注生産品。',
  },
  {
    id: 6,
    title: '獣人騎士団 キーホルダーセット',
    artist: 'テスト作家C',
    artistId: 3,
    price: 1200,
    category: 'キーホルダー',
    emoji: '⚔️',
    isNew: false,
    description: '獣人騎士3種のアクリルキーホルダーセット。',
  },
];

export const TEST_ARTISTS: TestArtist[] = [
  {
    id: 1,
    name: 'テスト作家A',
    specialty: 'フィギュア・グッズ',
    works: 12,
    emoji: '🐺',
    acceptingCommissions: true,
    bio: 'ケモノ系フィギュアを中心に制作しています。受注制作・一点ものも対応可。テストデータ用プロフィールです。',
  },
  {
    id: 2,
    name: 'テスト作家B',
    specialty: 'イラスト・ぬいぐるみ',
    works: 8,
    emoji: '🦊',
    acceptingCommissions: true,
    bio: 'デジタルイラストと手縫いぬいぐるみを制作しています。テストデータ用プロフィールです。',
  },
  {
    id: 3,
    name: 'テスト作家C',
    specialty: '書籍・雑貨',
    works: 5,
    emoji: '🐯',
    acceptingCommissions: false,
    bio: 'ケモノ小説の執筆と雑貨制作を行っています。テストデータ用プロフィールです。',
  },
];

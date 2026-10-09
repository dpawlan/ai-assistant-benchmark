/** Original screenshots supplied by the tester for publication. */
export const travelScreenshots: Record<string, {
  src: string; width: number; height: number; alt: string; caption: string; dimensions: number[];
}> = {
  dots: {
    src: '/travel-evidence/dots-flexible-trip-changes.png', width: 994, height: 1186,
    alt: 'Dots explains a flight change with no added payment and a $60.01 eCredit, obtains approval, and confirms the new flight.',
    caption: 'A confirmed flight change with no extra payment and a $60.01 credit.', dimensions: [9],
  },
  muse: {
    src: '/travel-evidence/muse-cancellation-clarity.png', width: 1332, height: 1358,
    alt: 'Muse explains the $354.40 refund and cancellation terms, asks for approval, then confirms cancellation.',
    caption: 'Clear refund terms, approval before acting, and cancellation confirmed.', dimensions: [8],
  },
  miso: {
    src: '/travel-evidence/miso-premium-support.png', width: 908, height: 1092,
    alt: 'Miso’s human team confirms with United that the additional $85.99 seat purchase has been refunded.',
    caption: 'Human support confirms the $85.99 seat refund.', dimensions: [8],
  },
  'grok-bot': {
    src: '/travel-evidence/grokbot-budget-booking.png', width: 940, height: 1108,
    alt: 'GrokBot compares evening flights and fare restrictions, then offers to book the selected $192 United option.',
    caption: 'Comparing low fares, arrival times and restrictions before booking.', dimensions: [20],
  },
};

import axios from 'axios';

export async function isAllowedByRobotsTxt(
  url: string,
  userAgent = '*',
): Promise<boolean> {
  try {
    const { origin, pathname } = new URL(url);
    const robotsUrl = `${origin}/robots.txt`;
    const res = await axios.get(robotsUrl);
    if (res.status !== 200) return true;

    const text = res.data as string;
    const lines = text.split('\n');
    let allowed = true;
    let applies = false;
    for (const line of lines) {
      if (line.toLowerCase().startsWith('user-agent')) {
        applies = line.includes(userAgent) || line.includes('*');
      }
      if (applies && line.toLowerCase().startsWith('disallow')) {
        const path = line.split(':')[1]?.trim();
        if (path && pathname.startsWith(path)) allowed = false;
      }
    }
    return allowed;
  } catch {
    return true;
  }
}

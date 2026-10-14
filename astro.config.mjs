import { defineConfig } from 'astro/config';
// The workflow sets these from the actual repository, so renaming it is safe.
const repository = process.env.GITHUB_REPOSITORY;
const [owner, name] = repository?.split('/') ?? ['jcpopdigitalpartners', 'course-library'];
export default defineConfig({
  site: `https://${owner}.github.io`,
  base: name === `${owner}.github.io` ? '/' : `/${name}`,
  output: 'static',
  trailingSlash: 'always',
});

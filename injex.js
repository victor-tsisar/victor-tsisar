//  Одержати масив репозитаріїв і відібрати 3-4 останні - сортування по id
//  Закинути їх в основний файл динамічним API
//  Підключити сценарій для оновлення
require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

async function main() {
    const readmeTemplate = (
        await fs.readFile(path.join(process.cwd(), "./README.template.md"))
    ).toString("utf-8");

    const repos = await (
        await fetch("https://api.github.com/users/victor-tsisar/repos")
    ).json();

    // function compareReverseId(a, b) {
    //     return b.id - a.id;
    // }

    let arr = repos.sort(
        function (a, b) {
            return b.id - a.id;
        }
    ).splice(0, 3);

    const renderReposLinks = () => {
        const linksList = [];

        function createReposLinks(data) {
            let itemReposLink = [];

            itemReposLink.innerHTML = `
                    <a href="https://github.com/victor-tsisar/${data.name}"><img align="center" style="margin:1rem" src="https://github-readme-stats.vercel.app/api/pin/?username=victor-tsisar&repo=${data.name}&title_color=ffffff&text_color=c9cacc&icon_color=4AB197&bg_color=1A2B34" /></a><br>
                `;

            return itemReposLink;
        }


        for (let i = 0; i < arr.length; i++) {
            const data = arr[i];

            linksList.push(createReposLinks(data));
        }

        return linksList;
    }

    const getReposLinks = () => {

        let reposLinks = '';

        for (let element of renderReposLinks()) {
            let itemRepos = element.innerHTML.trim();

            reposLinks += itemRepos;
        }

        return reposLinks;
    }

    const readme = readmeTemplate
        .replace("{reposLinks}", getReposLinks())


    await fs.writeFile("README.md", readme);
}

main();

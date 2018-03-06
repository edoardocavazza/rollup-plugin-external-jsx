function helper() {
    return 'Article 1';
}

<section className="section">
    <article className="article">{helper()}</article>
    <article className="article">Article {helper2}</article>
</section>

const helper2 = 2;
<script setup>
</script>

<template>
  <main>
    <div class='typora-export-content'>

      <div id='write' class=''>
        <h1 id='sentistrength'><span>SentiStrength</span></h1>
        <h2 id='简介'><span>简介</span></h2>
        <h3 id='什么是-sentistrength'><span>什么是 SentiStrength?</span></h3>
        <ul>
          <li><span>它为 Mike Thelwall 等人根据 MySpace 网站数据开发的社交文本情绪分析工具；</span></li>
          <li><span>Mike Thelwall 等人最先于 2010 年的发表的论文 </span><a
            href='https://doi.org/10.1002/asi.21416'><em><span>Sentiment Strength Detection in Short Informal
                Text</span></em></a><span> 中提出了该工具；后来，他们对更多种类的社交文本进行了探索，并形成了论文 </span><a
            href='https://doi.org/10.1002/asi.21662'><em><span>Sentiment Strength Detection for the Social
                Web</span></em></a><span> 于 2012 年发表。若您想细致的了解该工具，推荐优先阅读 </span><em><span>Sentiment Strength Detection in
              Short Informal Text</span></em><span> ，其中的描述更为详细。</span></li>
          <li><span>该工具的官网地址为：</span><a href='http://sentistrength.wlv.ac.uk' target='_blank'
                                                 class='url'>http://sentistrength.wlv.ac.uk</a><span>；</span></li>
          <li><span>官网提供了该工具的原版 jar 包，各种使用手册，以及可以试运行的 demo
            等。除此之外，它还罗列了与该工具有关的若干论文，并提供了工具开发过程中标注的数据集。若有任何疑问，可优先查看其官网。</span></li>
          <li><strong><span>该项目由反编译官网发布的 jar 包得来。</span></strong></li>
        </ul>
        <h3 id='我们在做什么'><span>我们在做什么？</span></h3>
        <blockquote>
          <p><strong><span>EASIEST</span></strong><span> (听着很简单但写起来很长的名字)</span></p>
          <p><span>Sentiment Analysis and Related Application </span></p>
          <p><span> </span><span>on Software Engineering Texts </span></p>
          <p><span> </span><span>from Collaborative Social Networks</span></p>
        </blockquote>
        <p><span>将 SentiStrength 改造为适合软工情绪文本分析的工具，并：</span></p>
        <ul>
          <li><span>为 SentiStrength 代码添加注释，使其有更好的可读性；</span></li>
          <li><span>分析 SentiStrength 的项目需求；</span></li>
          <li><span>优化 SentiStrength 的代码，排出潜在的 bug，对原有设计进行升级重构；</span></li>
          <li><span>为 SentiStrength 设计全新的 Web 前端；</span></li>
          <li><span>优化 SentiStrength 的运行效果</span></li>
          <li><span>and more...</span></li>
        </ul>
        <h3 id='你现在看到的是'><span>你现在看到的是</span></h3>
        <p><span>这里是 SentiStrength 的 Web 前端界面，你可以在这里尝试使用 SentiStrength 分析某个语句或者多行语句的情绪。</span></p>
      </div>
    </div>

  </main>
</template>

<style>
@import "@/assets/home.css";
</style>



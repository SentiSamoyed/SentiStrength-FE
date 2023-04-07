<template>

  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <span>分析选项</span>
        <el-button type='primary' @click='reset'>重置</el-button>
      </div>
    </template>

    <el-form :model='form' label-width='250px'>
      <el-form-item label='选择分析模式'>
        <el-select v-model='form.mode'>
          <el-option label='default' value='default' />
          <el-option label='binary' value='binary' />
          <el-option label='trinary' value='trinary' />
          <el-option label='scale' value='scale' />
        </el-select>
      </el-form-item>
      <el-form-item label='显示分析解释'>
        <el-switch v-model='form.explain' />
      </el-form-item>

      <el-collapse>
        <el-collapse-item title='更多选项'>
          <div class='checkboxes'>
            <el-checkbox class='checkbox' v-model='form.options.alwaysSplitWordsAtApostrophes'>总是在撇号处分词</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noBoosters'>不使用助推词</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noNegatingPositiveFlipsEmotion'>不使用否定词反转情绪</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noNegatingNegativeNeutralisesEmotion'>不使用否定词中和消极词</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noIdioms'>不使用习语</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.questionsReduceNeg'>在问句中减少消极情感</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noEmoticons'>不使用表情符号</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.exclamations2'>感叹号分数加二</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noMultiplePosWords'>不允许多个积极词增加积极情感</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noMultipleNegWords'>不允许多个消极词增加消极情感</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noIgnoreBoosterWordsAfterNegatives'>不忽略否定词后的助推词</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noDictionary'>不使用字典纠正拼写</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noDeleteExtraDuplicateLetters'>不删除单词中额外的重复字母</el-checkbox>
            <el-checkbox class='checkbox' v-model='form.options.noMultipleLetters'>不允许重复单词</el-checkbox>
          </div>

          <el-form-item label='否定词的强度倍数' style='margin: 1rem 0'>
            <el-input v-model='form.options.negatedWordStrengthMultiplier' style='width: 10rem' />
          </el-form-item>

          <el-form-item label='否定词与感情词之间的最大词数'>
            <el-input v-model='form.options.maxWordsBeforeSentimentToNegate' style='width: 10rem' />
          </el-form-item>

          <el-form-item label='心情'>
            <el-select v-model='form.options.mood' style='width: 10rem'>
              <el-option label='-1' value='-1'></el-option>
              <el-option label='0' value='0'></el-option>
              <el-option label='1' value='1'></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label='单词中的非法重复字母'>
              <el-input v-model='form.options.illegalDoubleLettersInWordMiddle' style='width: 160px'></el-input>
          </el-form-item>
          <el-form-item label='单词末尾的非法重复字母'>
            <el-input v-model='form.options.illegalDoubleLettersAtWordEnd' style='width: 160px'></el-input>
          </el-form-item>

        </el-collapse-item>
      </el-collapse>
    </el-form>

  </el-card>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'AnalyseOptions',
  data() {
    return {
      form: reactive({
        mode: 'default',
        explain: false,
        options: {
          'alwaysSplitWordsAtApostrophes': false,
          'noBoosters': false,
          'noNegatingPositiveFlipsEmotion': false,
          'noNegatingNegativeNeutralisesEmotion': false,
          'negatedWordStrengthMultiplier': 0.5,
          'maxWordsBeforeSentimentToNegate': 0,
          'noIdioms': false,
          'questionsReduceNeg': false,
          'noEmoticons': false,
          'exclamations2': false,
          'mood': 0,
          'noMultiplePosWords': false,
          'noMultipleNegWords': false,
          'noIgnoreBoosterWordsAfterNegatives': false,
          'noDictionary': false,
          'noDeleteExtraDuplicateLetters': false,
          'illegalDoubleLettersInWordMiddle': 'ahijkquvxyz',
          'illegalDoubleLettersAtWordEnd': 'achijkmnpqruvwxyz',
          'noMultipleLetters': false
        }
      })
    }
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}


</script>

<style scoped>
.card {
  margin: 1rem 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

el-form-item {
  width: 200px;
}

.checkboxes {
  margin: 1rem;
}

.checkbox {
  width: 200px;
}

</style>

<template>

  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>分析选项</span>
        </div>
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
            <el-checkbox v-model='form.options.alwaysSplitWordsAtApostrophes' class='checkbox'>总是在撇号处分词
            </el-checkbox>
            <el-checkbox v-model='form.options.noBoosters' class='checkbox'>不使用助推词</el-checkbox>
            <el-checkbox v-model='form.options.noNegatingPositiveFlipsEmotion' class='checkbox'>不使用否定词反转情绪
            </el-checkbox>
            <el-checkbox v-model='form.options.noNegatingNegativeNeutralisesEmotion' class='checkbox'>
              不使用否定词中和消极词
            </el-checkbox>
            <el-checkbox v-model='form.options.noIdioms' class='checkbox'>不使用习语</el-checkbox>
            <el-checkbox v-model='form.options.questionsReduceNeg' class='checkbox'>在问句中减少消极情感</el-checkbox>
            <el-checkbox v-model='form.options.noEmoticons' class='checkbox'>不使用表情符号</el-checkbox>
            <el-checkbox v-model='form.options.exclamations2' class='checkbox'>感叹号分数加二</el-checkbox>
            <el-checkbox v-model='form.options.noMultiplePosWords' class='checkbox'>不允许多个积极词增加积极情感
            </el-checkbox>
            <el-checkbox v-model='form.options.noMultipleNegWords' class='checkbox'>不允许多个消极词增加消极情感
            </el-checkbox>
            <el-checkbox v-model='form.options.noIgnoreBoosterWordsAfterNegatives' class='checkbox'>
              不忽略否定词后的助推词
            </el-checkbox>
            <el-checkbox v-model='form.options.noDictionary' class='checkbox'>不使用字典纠正拼写</el-checkbox>
            <el-checkbox v-model='form.options.noDeleteExtraDuplicateLetters' class='checkbox'>
              不删除单词中额外的重复字母
            </el-checkbox>
            <el-checkbox v-model='form.options.noMultipleLetters' class='checkbox'>不允许重复单词</el-checkbox>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'AnalyseOptions',
  components: { FontAwesomeIcon },
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
        }
      )
    }
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.call(this))
      this.$message.success('已重置选项')
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

.icon-text {
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-text span {
    flex: 1;
    min-width: 100px;
    text-align: center;
}
</style>

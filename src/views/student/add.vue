<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { ElMessage, FormInstance } from "element-plus";
import dayjs from "dayjs";

import getCollegeList from "@/api/college/getCollegeList";
import cityData from "@/api/student/data/city_data2017_element";

import { IStudentInfo } from "@/types/student/list";
import { collegeOption } from "@/types/college/index";

const handleBackClick = () => {
    router.back()
}

// 学院数据
let collegeList: collegeOption[] = reactive([]);
onMounted(() => {
    getCollegeList().then(res => {
        res.data.forEach((item) => {
            collegeList.push({ label: item, value: item });
        });
    });


});

const addStudentFormRef = ref<FormInstance>();
// 添加学生表单数据
let addStudentForm: IStudentInfo = reactive({
    name: "",
    age: 0,
    tel: "",
    sex: "",
    college: "",
    address: "",
    note: "",
    createTime: "",
});

// 表单验证规则
let addStudentrules = reactive({
    name: [{ required: true, message: "姓名为必填", trigger: "blur" }],
    age: [{ required: true, message: "年龄为必填", trigger: "blur" }],
    sex: [{ required: true, message: "性别为必选", trigger: "blur" }],
    tel: [{ required: true, message: "联系方式为必填", trigger: "blur" }],
});

// 提交
const router = useRouter();
const submitAddStudentForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        console.log('valid', valid)
        if (valid) {
            // 确认添加时生成创建时间 createTime
            addStudentForm.createTime = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss");
            addStudentForm.address = (addStudentForm.address as any).join(' ')
            // 此处调用接口将 addStudentForm 的数据添加到数据库
            // 这里暂时没有添加数据的接口，所以将添加的数据传给首页 idnex.vue 组件，放入本地的数据中
            const addStudentInfo = JSON.stringify(addStudentForm)
            router.push({ name: 'Student', params: { addStudentInfo: addStudentInfo } });
        } else {
            ElMessage.warning('添加失败!')
        }
    })

};
// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>
<template>
    <div class="add-student">
        <el-row class="add-student-header">
            <el-col :span="18">
                <h3 style="text-align: center">添加学生</h3>
            </el-col>
            <el-col class="back-btn" :span="6">
                <el-button type="primary" @click="handleBackClick">返回</el-button>
            </el-col>
        </el-row>
        <el-form class="add-student-form" ref="addStudentFormRef" :model="addStudentForm" status-icon
            :rules="addStudentrules" label-width="120px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="addStudentForm.name" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model.number="addStudentForm.age" type="number" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="addStudentForm.sex">
                    <el-radio label="男" size="large" border>男</el-radio>
                    <el-radio label="女" size="large" border>女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="联系方式" prop="tel">
                <el-input v-model="addStudentForm.tel" type="tel" />
            </el-form-item>
            <el-form-item label="学院" prop="college">
                <el-select v-model="addStudentForm.college" filterable placeholder="请选择">
                    <el-option v-for="item in collegeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
                <el-cascader v-model="addStudentForm.address" placeholder="尝试搜索" :options="cityData" filterable
                    clearable />
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input v-model="addStudentForm.note" :autosize="{ minRows: 3, maxRows: 4 }" type="textarea"
                    placeholder="请输入" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitAddStudentForm(addStudentFormRef)">添加</el-button>
                <el-button @click="resetForm(addStudentFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.add-student {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .add-student-header {
        width: 600px;

        .back-btn {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .add-student-form {
        width: 600px;
    }
}
</style>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";

import dayjs from 'dayjs';

import { IStudentInfo } from "@/types/student/list";
import { collegeOption } from "@/types/college/index";

import getStudentList from '@/api/student/getStudentList'
import getCollegeList from '@/api/college/getCollegeList'


// 本地数据 用于测试编辑功能，从接口获取的数据（随机mock的）会被添加到此数组
let studnetData: IStudentInfo[] = reactive([

]);
let collegeList: collegeOption[] = reactive([]);


const route = useRoute()
onMounted(() => {
    getStudentList().then(res => {
        studnetData.push(...res.data)
    }).catch((err) => {
        new Error(err)
    })
    getCollegeList().then(res => {
        res.data.forEach((item) => {
            collegeList.push({ label: item, value: item });
        });
    });


    // 这里是因为没有后端的添加接口
    // 如果接收到add组件添加的学生信息
    if (route.params.addStudentInfo) {
        let addStudentInfo = JSON.parse(route.params.addStudentInfo as string)
        studnetData.unshift(addStudentInfo)
    }
});

// 点击按钮跳转到添加学生信息页面
const router = useRouter();
const handleAddStudentBtnClick = () => {
    router.push("/student/add");
}

// 点击显示详情
let studentDetaildialogVisible = ref(false)
let studentDetail: IStudentInfo = reactive({
    name: "",
    sex: '',
    age: 0,
    tel: "",
    createTime: "",
    college: "",
    address: "",
    note: ""
})
const handleDetail = (row: IStudentInfo) => {
    // detailStudentIndex = index
    studentDetail.name = row.name
    studentDetail.age = row.age
    studentDetail.college = row.college
    studentDetail.sex = row.sex
    studentDetail.address = row.address
    studentDetail.tel = row.tel
    studentDetail.note = row.note
    studentDetail.createTime = row.createTime

    studentDetaildialogVisible.value = true
}


// 编辑学生
let editStudentIndex = ref(0)
let editDialogVisible = ref(false)
let editStudentForm: IStudentInfo = reactive({
    name: "",
    sex: '',
    age: 0,
    tel: "",
    createTime: "",
    college: "",
    address: "",
    note: ""
})

const handleEdit = (index: number, row: IStudentInfo) => {

    editStudentForm.name = row.name
    editStudentForm.age = row.age
    editStudentForm.college = row.college
    editStudentForm.sex = row.sex
    editStudentForm.address = row.address
    editStudentForm.tel = row.tel
    editStudentForm.note = row.note
    editStudentForm.createTime = row.createTime

    editStudentIndex.value = index
    editDialogVisible.value = true
}

const handleSubmitEdit = (index: number) => {
    editDialogVisible.value = false
    editStudentForm.createTime = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    studnetData.splice(index, 1, editStudentForm)
    editStudentIndex.value = 0
}


// 删除学生
const handleConfirmRemove = (index: number) => {
    studnetData.splice(index, 1)
}

// 分页模块
let currentPage = ref(1)    //当前页数
let pageSize = ref(10)       //每页的条数
let total = computed(() => studnetData.length)    // 总数

</script>

<template>
    <div>
        <el-row class="student-header">
            <el-col :span="20">
                <h3 style="text-align: center;">学生列表</h3>
            </el-col>
            <el-col class="add-student-btn" :span="4">
                <el-button type="primary" @click="handleAddStudentBtnClick">添加学生</el-button>
            </el-col>
        </el-row>
        <el-row class="student-content" justify="center">
            <el-table :data="studnetData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" height="350"
                style="width:65%;">
                <el-table-column type="index" label="序号" width="80"> </el-table-column>
                <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
                <el-table-column prop="age" label="年龄" width="120"> </el-table-column>
                <el-table-column prop="college" label="学院" width="220"> </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"> </el-table-column>
                <el-table-column label="操作" fixed="right" width="250">
                    <template #default="scope">
                        <el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                        <el-popconfirm confirm-button-text="确认" cancel-button-text="不" title="你确定要删除吗？"
                            @confirm="handleConfirmRemove(scope.$index)">
                            <template #reference>
                                <el-button size="small" type="danger">删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="student-list-pagination" background layout="sizes,prev, pager, next,jumper, -> ,total"
                :total="total" v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[2, 5, 10, 15, 20]" />
        </el-row>

        <el-dialog v-model="studentDetaildialogVisible" title="详情" width="40%" draggable>

            <el-descriptions :column="1">
                <el-descriptions-item label="姓名">{{ studentDetail.name }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{ studentDetail.age }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ studentDetail.sex }}</el-descriptions-item>
                <el-descriptions-item label="学院">{{ studentDetail.college }}</el-descriptions-item>
                <el-descriptions-item label="联系方式">
                    {{ studentDetail.tel }}
                </el-descriptions-item>
                <el-descriptions-item label="地址">{{ studentDetail.address }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>

        <el-dialog v-model="editDialogVisible" title="编辑" width="30%" draggable>
            <el-form ref="editStudentFormRef" :model="editStudentForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editStudentForm.name" type="text" />
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="editStudentForm.age" type="number" />
                </el-form-item>
                <el-form-item label="学院" prop="college">
                    <!-- <el-input v-model="editStudentForm.college" /> -->
                    <el-select v-model="editStudentForm.college" filterable placeholder="请选择">
                        <el-option v-for="item in collegeList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmitEdit(editStudentIndex)">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.student-header {
    color: red;

    .add-student-btn {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.student-content {
    align-items: center;
    flex-direction: column;

    .student-list-pagination {
        margin-top: 20px;
    }
}
</style>

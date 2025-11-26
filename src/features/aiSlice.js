import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
import { config } from "../config/env";
import { createTask, updateTask, deleteTask } from "./taskSlice";

const callGeminiAPI = async (message, conversationHistory = []) => {
  try {
    const systemPrompt = `Bạn là trợ lý AI thông minh cho ứng dụng quản lý task. 

QUAN TRỌNG: Khi người dùng muốn TẠO, SỬA, XÓA task, BẠN PHẢI trả về JSON theo format SAU ĐÂY:

1. TẠO TASK: Khi người dùng nói "tạo task...", "thêm task...", "lên lịch...", "nhắc tôi..." hoặc đề cập đến việc cần làm
{
  "action": "create_task",
  "data": {
    "name": "Tên task ngắn gọn",
    "description": "Mô tả chi tiết về task",
    "startTime": "2025-11-26T04:03:19.635Z",
    "endTime": "2025-11-26T04:03:19.635Z",
    "priority": "Low" hoặc "Medium" hoặc "High",
    "status": "Todo"
  },
  "message": "Thông báo cho user"
}

1B. TẠO NHIỀU TASKS TỰ ĐỘNG: Khi người dùng yêu cầu gen/suggest/tạo tasks về một chủ đề cụ thể
KHI NGƯỜI DÙNG CHỈ GỢI Ý CHỦ ĐỀ (ví dụ: "gen tasks về học React", "tạo lộ trình học Python"), BẠN PHẢI:
- TỰ ĐỘNG SUY NGHĨ và tạo 5-10 tasks CHI TIẾT từ cơ bản đến nâng cao
- MỖI TASK phải có: tên rõ ràng, mô tả chi tiết, links tham khảo trong "note"
- Thêm links học tập vào "note": "URL1, URL2..." (React docs, YouTube, courses...)
- SẮP XẾP theo thứ tự logic (từ dễ đến khó)
- ƯU TIÊN tasks theo mức độ quan trọng (High/Medium/Low)
- **QUAN TRỌNG**: Thêm field "durationHours" cho mỗi task:
  * Ước tính thời gian cần thiết để hoàn thành task (0.5 - 6 giờ)
  * Dựa vào độ phức tạp của nội dung, KHÔNG phải priority
  * Ví dụ: học cú pháp cơ bản = 1-2h, xây dựng project = 4-6h
- LƯU Ý: User chỉ làm 5-6 giờ/ngày, hệ thống sẽ tự động:
  * Chia tasks ra nhiều ngày nếu cần
  * Ngày hôm sau bắt đầu từ 8h sáng
  * Mỗi ngày làm việc từ 8h-13h hoặc 14h-19h (5-6h)

{
  "action": "create_multiple_tasks",
  "tasks": [
    {
      "name": "Tên task cụ thể và rõ ràng",
      "description": "Mô tả CHI TIẾT:\n- Nội dung cần học/làm\n- Mục tiêu cần đạt được\n- Kiến thức cần nắm",
      "priority": "High/Medium/Low (mức độ quan trọng)",
      "durationHours": 2.5,
      "status": "Todo",
      "note": "Links: https://reactjs.org, https://youtube.com/..."
    }
  ],
  "message": "Thông báo đã tạo bao nhiêu tasks và tổng quan lộ trình"
}

VÍ DỤ durationHours:
- Học cú pháp cơ bản: 3-4h
- Thực hành exercises: 10-12h
- Xây dựng mini project: 3-4 days
- Đọc documentation: 1-2h

LƯU Ý: startTime/endTime sẽ TỰ ĐỘNG TÍNH với quy tắc 5-6h/ngày!

VÍ DỤ CỤ THỂ:
User: "Gen cho tôi tasks về học React"
→ AI TỰ ĐỘNG TẠO 8-10 tasks:
1. "Học cơ bản về React - JSX và Components" (Priority: High, Description chi tiết với links)
2. "Thực hành React Hooks - useState và useEffect" (Priority: High)
3. "Xây dựng Todo App với React" (Priority: Medium)
...và tiếp tục cho đến nâng cao

2. SỬA TASK: Khi người dùng nói "sửa task [id]...", "cập nhật task [id]..."
{
  "action": "update_task",
  "taskId": "id của task",
  "data": {
    "name": "Tên mới (nếu có)",
    "description": "Mô tả mới (nếu có)",
    "priority": "Low/Medium/High (nếu có)",
    "status": "Todo/InProgress/Review/Done (nếu có)"
  },
  "message": "Thông báo cho user"
}

3. XÓA TASK: Khi người dùng nói "xóa task [id]", "hủy task [id]"
{
  "action": "delete_task",
  "taskId": "id của task",
  "message": "Thông báo cho user"
}

4. LIỆT KÊ TẤT CẢ TASK: Khi người dùng hỏi "liệt kê task", "danh sách task", "có những task nào"
{
  "action": "list_tasks",
  "message": "Thông báo cho user"
}

5. XÓA TẤT CẢ TASK: Khi người dùng nói "xóa tất cả task", "xóa hết task", "clear all tasks"
{
  "action": "delete_all_tasks",
  "message": "Thông báo cho user"
}

6. CHỈ TRẢ LỜI: Nếu chỉ là câu hỏi thông thường, trả lời văn bản bình thường KHÔNG phải JSON.

QUAN TRỌNG VỀ TẠO NHIỀU TASKS:
- Khi user nói "gen tasks về [chủ đề]", "tạo lộ trình [chủ đề]", "suggest tasks [chủ đề]"
- BẠN PHẢI tự động suy nghĩ và tạo 5-10 tasks chi tiết, có cấu trúc
- Mỗi task cần có ngày bắt đầu tương đối (ví dụ: "Tuần 1", "Ngày 1-3", "Từ 27/11-30/11")
- Thêm links học tập nếu có thể (React docs, YouTube, courses...)
- Sắp xếp từ cơ bản → nâng cao

VÍ DỤ THỰC TẾ:
User: "Học tập ngày 26/11/2025 lúc 14 giờ đến 15 giờ" → TẠO 1 TASK
User: "Nhắc tôi họp với sếp vào 3h chiều" → TẠO 1 TASK  
User: "Gen cho tôi tasks về học React" → CREATE_MULTIPLE_TASKS (TỰ GEN 8-10 tasks chi tiết)
User: "Tạo lộ trình học Python cơ bản" → CREATE_MULTIPLE_TASKS (TỰ GEN 5-8 tasks)
User: "Suggest tasks cho dự án web" → CREATE_MULTIPLE_TASKS (TỰ GEN tasks phù hợp)
User: "Sửa task 5 thành priority High" → SỬA TASK
User: "Xóa task 3" → XÓA TASK
User: "Danh sách task" → LIST_TASKS
User: "Xóa tất cả task" → DELETE_ALL_TASKS

LUÔN TẠO TASKS CHI TIẾT VÀ CHẤT LƯỢNG CAO!
BẮT ĐẦU PHÂN TÍCH:`;

    const fullMessage = `${systemPrompt}\n\nNgười dùng: ${message}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullMessage,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API HTTP Error:", errorData);
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates.length) {
      console.error("Gemini API Response:", data);
      throw new Error("Gemini API không trả về kết quả hợp lệ. Vui lòng kiểm tra API key.");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const parseGeminiResponse = (response) => {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      const validActions = ['create_task', 'update_task', 'delete_task', 'list_tasks', 'delete_all_tasks', 'create_multiple_tasks'];
      if (parsed.action && _.includes(validActions, parsed.action)) {
        if (parsed.action === 'create_task' && parsed.data) {
          parsed.data = {
            name: parsed.data.name || "New Task",
            description: parsed.data.description || "",
            status: parsed.data.status || "Todo",
            priority: parsed.data.priority || "Medium",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            note: parsed.data.note || "",
          };
        }
        
        if (parsed.action === 'create_multiple_tasks' && parsed.tasks) {
          let currentDate = new Date();
          const WORK_HOURS_PER_DAY = 5.5; 
          const WORK_START_HOUR = 8; 
          let dailyHoursUsed = 0;
          
          parsed.tasks = _.map(parsed.tasks, (task, index) => {
            let durationHours = task.durationHours || 2;
            if (!task.durationHours) {
              if (task.priority === 'High') durationHours = 4;
              else if (task.priority === 'Medium') durationHours = 2.5;
              else durationHours = 1.5;
            }
            
            durationHours = Math.max(0.5, Math.min(6, durationHours));
            
            let startTime, endTime;
            
            if (dailyHoursUsed + durationHours > WORK_HOURS_PER_DAY) {
              currentDate.setDate(currentDate.getDate() + 1);
              currentDate.setHours(WORK_START_HOUR, 0, 0, 0);
              dailyHoursUsed = 0;
            }
            startTime = new Date(currentDate);
            const durationMs = durationHours * 60 * 60 * 1000;
            endTime = new Date(currentDate.getTime() + durationMs);
            currentDate = new Date(endTime);
            dailyHoursUsed += durationHours; 
            return {
              name: task.name || "New Task",
              description: task.description || "",
              status: task.status || "Todo",
              priority: task.priority || "Medium",
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              note: task.note || "",
            };
          });
        }
        
        return parsed;
      }
    }
    
    return null;
  } catch (error) {
    console.log("Not a JSON response, treating as normal text");
    return null;
  }
};

export const sendMessage = createAsyncThunk(
  "ai/sendMessage",
  async (message, { rejectWithValue, dispatch, getState }) => {
    try {
      const geminiResponse = await callGeminiAPI(message);
      const taskCommand = parseGeminiResponse(geminiResponse);
      
      if (taskCommand) {
        let responseMessage = taskCommand.message || "";
        
        try {
          if (taskCommand.action === "create_task") {
            await dispatch(createTask(taskCommand.data)).unwrap();
            responseMessage = `✅ ${taskCommand.message || `Đã tạo task "${taskCommand.data.name}" thành công!`}`;
          } else if (taskCommand.action === "create_multiple_tasks") {
            const tasks = taskCommand.tasks || [];
            if (_.isEmpty(tasks)) {
              responseMessage = "Không có task nào để tạo.";
            } else {
              const createdTasks = [];
              for (const task of tasks) {
                try {
                  const created = await dispatch(createTask(task)).unwrap();
                  createdTasks.push({ ...task, id: created.id });
                } catch (error) {
                  console.error("Error creating task:", error);
                }
              }
              
              const taskList = _.map(createdTasks, (task, index) => {
                const shortDesc = _.truncate(task.description, { length: 80 });
                return `${index + 1}. ✅ ${task.name}\n   📝 ${shortDesc}\n   📌 Priority: ${task.priority}`;
              }).join('\n\n');
              
              responseMessage = `🎯 ${taskCommand.message || `Đã tạo ${createdTasks.length} tasks thành công!`}\n\n${taskList}\n\n💡 Bạn có thể xem chi tiết từng task trong danh sách tasks!`;
            }
          } else if (taskCommand.action === "update_task") {
            const cleanId = String(taskCommand.taskId).replace(/^#/, '');
            const updates = _.omitBy(taskCommand.data, _.isUndefined);
            
            const state = getState();
            const taskExists = _.find(state.tasks.items, { id: cleanId });
            if (!taskExists) {
              responseMessage = `Không tìm thấy task với ID "${cleanId}". Vui lòng kiểm tra lại ID.`;
            } else {
              await dispatch(updateTask({ id: cleanId, data: updates })).unwrap();
              responseMessage = `${taskCommand.message || `Đã cập nhật task #${cleanId} thành công!`}`;
            }
          } else if (taskCommand.action === "delete_task") {
            const cleanId = String(taskCommand.taskId).replace(/^#/, '');
            
            const state = getState();
            const taskExists = _.find(state.tasks.items, { id: cleanId });
            if (!taskExists) {
              responseMessage = `Không tìm thấy task với ID "${cleanId}". Vui lòng kiểm tra lại ID.`;
            } else {
              await dispatch(deleteTask(cleanId)).unwrap();
              responseMessage = ` ${taskCommand.message || `Đã xóa task #${cleanId} thành công!`}`;
            }
          } else if (taskCommand.action === "list_tasks") {
            const state = getState();
            const tasks = state.tasks.items;
            
            if (_.isEmpty(tasks)) {
              responseMessage = "📋 Hiện tại chưa có task nào.";
            } else {
              const taskList = _.map(tasks, (task, index) => {
                const priority = task.priority || 'Medium';
                const status = task.status || 'Todo';
                return `${index + 1}. ${task.name} (ID: ${task.id})\n   📌 Priority: ${priority} | Status: ${status}\n   📝 ${task.description || 'Không có mô tả'}`;
              }).join('\n\n');
              
              responseMessage = `📋 Danh sách task (${tasks.length} task):\n\n${taskList}`;
            }
          } else if (taskCommand.action === "delete_all_tasks") {
            const state = getState();
            const tasks = state.tasks.items;
            
            if (_.isEmpty(tasks)) {
              responseMessage = "📋 Không có task nào để xóa.";
            } else {
              const deletePromises = _.map(tasks, (task) => dispatch(deleteTask(task.id)).unwrap());
              await Promise.all(deletePromises);
              responseMessage = ` Đã xóa tất cả ${tasks.length} task thành công!`;
            }
          }
        } catch (actionError) {
          responseMessage = ` Lỗi: ${actionError.message || "Không thể thực hiện thao tác"}`;
        }
        
        return {
          userMessage: message,
          aiResponse: responseMessage,
          timestamp: new Date().toISOString(),
          actionPerformed: true,
        };
      }
      
      return {
        userMessage: message,
        aiResponse: geminiResponse,
        timestamp: new Date().toISOString(),
        actionPerformed: false,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    messages: [
      {
        id: 1,
        type: "ai",
        content: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp gì cho bạn?",
        timestamp: new Date().toISOString(),
      },
    ],
    loading: false,
    error: null,
    isOpen: false,
  },
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    clearMessages: (state) => {
      state.messages = [
        {
          id: 1,
          type: "ai",
          content: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp gì cho bạn?",
          timestamp: new Date().toISOString(),
        },
      ];
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        type: "user",
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: Date.now(),
          type: "ai",
          content: action.payload.aiResponse,
          timestamp: action.payload.timestamp,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.messages.push({
          id: Date.now(),
          type: "ai",
          content: "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.",
          timestamp: new Date().toISOString(),
        });
      });
  },
});

export const { toggleChat, openChat, closeChat, clearMessages, addUserMessage } = aiSlice.actions;
export default aiSlice.reducer;

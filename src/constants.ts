/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DialogueNode, Evidence } from './types';

export const ALL_EVIDENCE: Record<string, Evidence> = {
  'lunch_box': {
    id: 'lunch_box',
    name: 'Hộp Cơm Trưa',
    description: 'Hộp cơm của nạn nhân. Bên trong trống rỗng nhưng vẫn còn mùi cà ri.',
    image: 'https://instandeebinhthanh.com/wp-content/uploads/2024/11/anh-dep-thien-nhien-2-1024x640.jpg',
  },
  'receipt': {
    id: 'receipt',
    name: 'Hóa Đơn Cửa Hàng',
    description: 'Hóa đơn mua cà ri lúc 12:30 trưa nay.',
    image: 'https://picsum.photos/seed/receipt/200/200',
  },
  'photo_of_thief': {
    id: 'photo_of_thief',
    name: 'Ảnh Chụp Kẻ Trộm',
    description: 'Một bức ảnh mờ nhạt chụp ai đó đang chạy trốn với một chiếc hộp.',
    image: 'https://picsum.photos/seed/blur/200/200',
  }
};

export const DIALOGUE_TREE: Record<string, DialogueNode> = {
  'intro_1': {
    id: 'intro_1',
    speaker: 'Luật Sư',
    text: 'Tòa án đang bắt đầu phiên xử. Bị cáo bị buộc tội trộm hộp cơm trưa của đồng nghiệp.',
    emotion: 'thinking',
    background: 'https://picsum.photos/seed/court_wide/1200/800',
    characterImage: 'https://picsum.photos/seed/lawyer/400/600',
    nextId: 'decision_point',
  },
  'decision_point': {
    id: 'decision_point',
    speaker: 'Luật Sư',
    text: 'Chúng ta nên làm gì tiếp theo đây?',
    emotion: 'thinking',
    background: 'https://picsum.photos/seed/court_side/1200/800',
    choices: [
      { text: 'Kiểm tra bằng chứng', nextId: 'intro_2' },
      { text: 'Thẩm vấn nhân chứng', nextId: 'witness_1' },
      { text: 'Yêu cầu hoãn tòa', nextId: 'intro_1' },
      { text: 'Đầu hàng', nextId: 'the_end' }
    ]
  },
  'intro_2': {
    id: 'intro_2',
    speaker: 'Tòa Án',
    text: 'Công tố viên, hãy gọi nhân chứng đầu tiên của bạn.',
    emotion: 'normal',
    background: 'https://picsum.photos/seed/judge_bench/1200/800',
    characterImage: 'https://picsum.photos/seed/judge/400/600',
    nextId: 'witness_1',
  },
  'witness_1': {
    id: 'witness_1',
    speaker: 'Nhân Chứng',
    text: 'Tôi thề là tôi đã thấy anh ta ăn hộp cơm đó vào lúc 12:00 trưa!',
    emotion: 'normal',
    background: 'https://picsum.photos/seed/witness_stand/1200/800',
    characterImage: 'https://picsum.photos/seed/witness/400/600',
    nextId: 'witness_2',
  },
  'witness_2': {
    id: 'witness_2',
    speaker: 'Nhân Chứng',
    text: 'Đó là một hộp cơm màu xanh, và anh ta trông rất sảng khoái.',
    emotion: 'happy',
    background: 'https://picsum.photos/seed/witness_smile/1200/800',
    characterImage: 'https://picsum.photos/seed/witness/400/600',
    nextId: 'cross_exam_start',
  },
  'cross_exam_start': {
    id: 'cross_exam_start',
    speaker: 'Luật Sư',
    text: '(Phải tìm ra sơ hở trong lời khai này. Hãy kiểm tra các bằng chứng!)',
    emotion: 'thinking',
    background: 'https://picsum.photos/seed/lawyer_desk/1200/800',
    choices: [
      { text: 'Bắt đầu thẩm vấn', nextId: 'ce_node_1' }
    ]
  },
  'ce_node_1': {
    id: 'ce_node_1',
    speaker: 'Nhân Chứng',
    text: 'Tôi khẳng định chắc chắn: Anh ta đã ăn nó lúc 12:00 trưa nay!',
    emotion: 'normal',
    background: 'https://picsum.photos/seed/witness_stand/1200/800',
    characterImage: 'https://picsum.photos/seed/witness/400/600',
    isStatement: true,
    correctEvidence: 'receipt',
    onCorrectionId: 'win_case',
    onWrongId: 'wrong_evidence_1',
    nextId: 'ce_node_2',
  },
  'ce_node_2': {
    id: 'ce_node_2',
    speaker: 'Nhân Chứng',
    text: 'Tôi thấy anh ta ở phòng nghỉ, một mình với hộp cơm đó.',
    emotion: 'normal',
    background: 'https://picsum.photos/seed/break_room/1200/800',
    characterImage: 'https://picsum.photos/seed/witness/400/600',
    isStatement: true,
    correctEvidence: 'not_found',
    nextId: 'ce_node_1',
  },
  'wrong_evidence_1': {
    id: 'wrong_evidence_1',
    speaker: 'Kiểm Sát Viên',
    text: 'Cái gì thế này? Bằng chứng đó chẳng liên quan gì cả!',
    emotion: 'angry',
    background: 'https://picsum.photos/seed/prosecutor_bench/1200/800',
    characterImage: 'https://picsum.photos/seed/prosecutor/400/600',
    nextId: 'ce_node_1',
  },
  'win_case': {
    id: 'win_case',
    speaker: 'Luật Sư',
    text: 'OBJECTION! Thưa tòa, hóa đơn này cho thấy hộp cơm chỉ được mua lúc 12:30!',
    emotion: 'surprised',
    background: 'https://picsum.photos/seed/evidence_close_up/1200/800',
    characterImage: 'https://picsum.photos/seed/lawyer/400/600',
    nextId: 'win_end',
  },
  'win_end': {
    id: 'win_end',
    speaker: 'Tòa Án',
    text: 'Vô lý! Vậy nhân chứng không thể thấy bị cáo ăn nó lúc 12:00. Bị cáo vô tội!',
    emotion: 'surprised',
    background: 'https://picsum.photos/seed/judge_surprised/1200/800',
    characterImage: 'https://picsum.photos/seed/judge/400/600',
    nextId: 'the_end',
  },
  'the_end': {
    id: 'the_end',
    speaker: 'Hệ Thống',
    text: 'Chúc mừng! Bạn đã phá xong vụ án đầu tiên.',
    emotion: 'normal',
    choices: [
      { text: 'Chơi lại', nextId: 'intro_1' },
      { text: 'Về Menu', nextId: 'MENU' }
    ]
  },
  'game_over': {
    id: 'game_over',
    speaker: 'Thẩm Phán',
    text: 'Bào chữa của bạn quá yếu ớt! Tôi tuyên bố bị cáo CÓ TỘI. Phiên tòa kết thúc!',
    emotion: 'angry',
    background: 'https://picsum.photos/seed/judge_angry/1200/800',
    choices: [
      { text: 'Thử lại', nextId: 'intro_1' },
      { text: 'Về Menu', nextId: 'MENU' }
    ]
  }
};

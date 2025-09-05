import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { SoundOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectVoiceSettings } from '../../store/slices/settingsSlice';

const VoiceAssistant = () => {
  const voiceSettings = useSelector(selectVoiceSettings);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // 语音助手功能仅在启用时显示
  if (!voiceSettings.enableVoiceAssistant) {
    return null;
  }

  // 初始化语音识别
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.lang = 'zh-CN'; // 设置为中文
      recog.interimResults = false; // 不返回中间结果
      recog.maxAlternatives = 1; // 返回最佳匹配结果

      // 当检测到语音时触发
      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sayPredefinedSentence();
      };

      // 语音识别错误处理
      recog.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        setIsListening(false); // 出错时停止监听
      };

      // 语音识别结束时
      recog.onend = () => {
        setIsListening(false); // 停止监听
      };

      setRecognition(recog);
    } else {
      console.warn('浏览器不支持 Web Speech API');
    }
  }, []);

  // 预定义句子输出函数
  const sayPredefinedSentence = () => {
    const sentence = '您好，我听到了您的声音！';
    console.log(sentence); // 在控制台输出预定义句子
    // 可选：使用 SpeechSynthesis API 读出句子
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // 切换监听状态
  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Tooltip title={isListening ? "点击停止语音助手" : "点击启动语音助手"}>
      <Button
        type="text"
        icon={isListening ? <SoundOutlined /> : <AudioMutedOutlined />}
        onClick={toggleListening}
        className={isListening ? 'voice-assistant-active' : ''}
        style={{ 
          color: '#fff', 
          marginRight: 16,
          backgroundColor: isListening ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
        }}
        disabled={!recognition} // 如果浏览器不支持语音识别，禁用按钮
      />
    </Tooltip>
  );
};

export default VoiceAssistant;

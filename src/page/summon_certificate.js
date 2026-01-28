import { useState } from 'react';
import { Container, Card, Button, Alert, Row, Col, Form, ProgressBar } from 'react-bootstrap';
import { JSEncrypt } from 'jsencrypt';

const SummonCertificate = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [secret1, setSecret1] = useState('');
    const [secret2, setSecret2] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState('');
    const [savedFiles, setSavedFiles] = useState([]);

    // 模拟生成过程的步骤
    const steps = [
        { name: '初始化RSA加密器', weight: 10 },
        { name: '生成RSA-4096密钥对', weight: 40 },
        { name: '生成第一个随机Secret', weight: 20 },
        { name: '生成第二个随机Secret', weight: 20 },
        { name: '完成生成过程', weight: 10 }
    ];

    // 生成RSA密钥对
    const generateKeyPair = () => {
        setCurrentStep('生成RSA-4096密钥对');
        const encrypt = new JSEncrypt({ default_key_size: 4096 });
        
        // 生成密钥对
        const publicKey = encrypt.getPublicKey();
        const privateKey = encrypt.getPrivateKey();
        
        setPublicKey(publicKey);
        setPrivateKey(privateKey);
        return true;
    };

    // 生成随机secret
    const generateRandomSecret = (length = 32) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let result = '';
        const cryptoArray = new Uint8Array(length);
        
        if (typeof window !== 'undefined' && window.crypto) {
            window.crypto.getRandomValues(cryptoArray);
            for (let i = 0; i < length; i++) {
                result += chars.charAt(cryptoArray[i] % chars.length);
            }
        } else {
            // 备用方案
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        return result;
    };

    // 生成两个不同的secret
    const generateSecrets = () => {
        setCurrentStep('生成第一个随机Secret');
        let secret1 = generateRandomSecret();
        
        setCurrentStep('生成第二个随机Secret');
        let secret2 = generateRandomSecret();
        
        // 确保两个secret不相同
        while (secret1 === secret2) {
            secret2 = generateRandomSecret();
        }
        
        setSecret1(secret1);
        setSecret2(secret2);
    };

    // 模拟进度更新
    const updateProgress = (stepIndex, increment) => {
        setProgress(prev => {
            const currentWeight = steps.slice(0, stepIndex).reduce((sum, step) => sum + step.weight, 0);
            return Math.min(currentWeight + increment, 100);
        });
    };

    // 一键生成所有内容（带进度条）
    const handleGenerateAll = async () => {
        setIsGenerating(true);
        setProgress(0);
        setCurrentStep('初始化RSA加密器');

        try {
            // 步骤1: 初始化
            await new Promise(resolve => {
                setTimeout(() => {
                    updateProgress(0, 10);
                    resolve();
                }, 300);
            });

            // 步骤2: 生成密钥对
            await new Promise(resolve => {
                setTimeout(() => {
                    generateKeyPair();
                    updateProgress(1, 40);
                    resolve();
                }, 800);
            });

            // 步骤3: 生成secrets
            await new Promise(resolve => {
                setTimeout(() => {
                    generateSecrets();
                    updateProgress(3, 40);
                    resolve();
                }, 600);
            });

            // 步骤4: 完成
            await new Promise(resolve => {
                setTimeout(() => {
                    setCurrentStep('完成生成过程');
                    setProgress(100);
                    setIsGenerated(true);
                    setIsGenerating(false);
                    resolve();
                }, 300);
            });

        } catch (error) {
            console.error('生成过程中出错:', error);
            setIsGenerating(false);
        }
    };

    // 保存到本地文件（确保每次下载都是新文件）
    const saveToLocalFile = (content, filename, fileType = 'text/plain') => {
        const blob = new Blob([content], { type: fileType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // 添加时间戳确保文件名唯一，避免浏览器缓存
        const timestamp = new Date().getTime();
        const uniqueFilename = filename.replace(/(\.\w+)$/, `_${timestamp}$1`);
        link.download = uniqueFilename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 清理URL对象
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        // 记录保存的文件
        setSavedFiles(prev => [...prev, {
            filename: uniqueFilename,
            timestamp: new Date().toLocaleString(),
            type: fileType
        }]);
    };

    // 保存所有内容到本地
    const saveAllToLocal = () => {
        const timestamp = new Date().toISOString().split('T')[0];
        const uniqueId = new Date().getTime();
        
        // 保存公钥
        saveToLocalFile(publicKey, `public_key_${timestamp}.pem`, 'text/plain');
        
        // 保存私钥
        saveToLocalFile(privateKey, `private_key_${timestamp}.pem`, 'text/plain');
        
        // 保存secrets到JSON文件
        const secretsData = {
            secret1: secret1,
            secret2: secret2,
            generatedAt: new Date().toISOString(),
            note: '请妥善保管这些敏感信息',
            keySize: 4096
        };
        saveToLocalFile(JSON.stringify(secretsData, null, 2), `secrets_${timestamp}.json`, 'application/json');
        
        // 保存综合配置文件
        const configData = {
            metadata: {
                generatedAt: new Date().toISOString(),
                keySize: 4096,
                version: '1.0',
                uniqueId: uniqueId
            },
            publicKey: publicKey,
            privateKey: '*** PRIVATE KEY - 已单独保存 ***',
            secrets: {
                secret1: '*** SECRET - 已单独保存 ***',
                secret2: '*** SECRET - 已单独保存 ***'
            },
            note: '敏感信息已分别保存在单独的文件中，请妥善保管'
        };
        saveToLocalFile(JSON.stringify(configData, null, 2), `certificate_config_${timestamp}.json`, 'application/json');
        
        alert('所有文件已成功保存到本地！');
    };

    // 复制到剪贴板
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('复制成功!');
            })
            .catch(err => {
                console.error('复制失败: ', err);
                // 备用方案
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('复制成功!');
            });
    };

    // 加密测试函数
    const testEncryption = () => {
        if (!publicKey || !privateKey) return;
        
        const encrypt = new JSEncrypt();
        const decrypt = new JSEncrypt();
        
        encrypt.setPublicKey(publicKey);
        decrypt.setPrivateKey(privateKey);
        
        const testText = 'Hello, RSA Encryption Test!';
        const encrypted = encrypt.encrypt(testText);
        
        if (!encrypted) {
            alert('加密失败，请检查公钥格式');
            return;
        }
        
        const decrypted = decrypt.decrypt(encrypted);
        
        if (decrypted === testText) {
            alert(`✅ 加密测试成功!\n原文: ${testText}\n解密后: ${decrypted}`);
        } else {
            alert(`❌ 加密测试失败!\n原文: ${testText}\n解密后: ${decrypted}`);
        }
    };

    // 重置所有状态
    const handleReset = () => {
        setPublicKey('');
        setPrivateKey('');
        setSecret1('');
        setSecret2('');
        setIsGenerated(false);
        setProgress(0);
        setCurrentStep('');
        setSavedFiles([]);
    };

    return (
        <Container>
            <br/>
            <Card className="card-primary card-outline">
                <Card.Header>
                    <Card.Title>🔐 App证书生成工具</Card.Title>
                </Card.Header>

                <Card.Body>
                    {!isGenerated && !isGenerating ? (
                        <div className="text-center">
                            <Button 
                                variant="primary" 
                                size="lg"
                                onClick={handleGenerateAll}
                                disabled={isGenerating}
                            >
                                🚀 生成RSA密钥对和Secret
                            </Button>
                            <p className="mt-3 text-muted">
                                点击按钮生成RSA-4096密钥对和两个随机Secret
                                <span className='text-danger'>（此过程不会上传到服务器）</span>
                            </p>
                        </div>
                    ) : isGenerating ? (
                        <div className="text-center">
                            <Alert variant="info">
                                <Alert.Heading>⏳ 正在生成...</Alert.Heading>
                                <p className="mb-2">
                                    <strong>当前步骤:</strong> {currentStep}
                                </p>
                                <small className="text-muted">
                                    生成RSA-4096密钥可能需要一些时间，请耐心等待...
                                </small>
                            </Alert>
                            
                            <ProgressBar 
                                animated 
                                now={progress} 
                                label={`${progress}%`}
                                className="mb-3"
                                variant="success"
                                style={{ height: '25px' }}
                            />
                            
                            <div className="mt-3">
                                <Button 
                                    variant="outline-secondary" 
                                    disabled
                                >
                                    ⏳ 请稍候... ({progress}%)
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>✅ 生成成功!</Alert.Heading>
                                <p>已成功生成RSA-4096密钥对和两个随机Secret。</p>
                                <div className="mt-2">
                                    <Button 
                                        variant="outline-success" 
                                        size="sm"
                                        onClick={saveAllToLocal}
                                        className="me-2"
                                    >
                                        💾 一键保存所有文件
                                    </Button>
                                    <Button 
                                        variant="outline-info" 
                                        size="sm"
                                        onClick={() => {
                                            const allData = `=== RSA-4096 证书生成结果 ===\n生成时间: ${new Date().toLocaleString()}\n\n公钥:\n${publicKey}\n\n私钥:\n${privateKey}\n\nSecret 1: ${secret1}\nSecret 2: ${secret2}`;
                                            copyToClipboard(allData);
                                        }}
                                    >
                                        📋 复制全部内容
                                    </Button>
                                </div>
                            </Alert>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            <strong>🔑 公钥 Public Key</strong>
                                            <div className="mt-1">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => copyToClipboard(publicKey)}
                                                >
                                                    复制
                                                </Button>
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => saveToLocalFile(publicKey, 'public_key.pem')}
                                                >
                                                    保存为文件
                                                </Button>
                                            </div>
                                        </Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={6} 
                                            value={publicKey}
                                            readOnly
                                            className="font-monospace"
                                            style={{ fontSize: '0.8rem' }}
                                        />
                                    </Form.Group>
                                </Col>
                                
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            <strong>🔒 私钥 Private Key</strong>
                                            <div className="mt-1">
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => copyToClipboard(privateKey)}
                                                >
                                                    复制
                                                </Button>
                                                <Button 
                                                    variant="outline-warning" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => saveToLocalFile(privateKey, 'private_key.pem')}
                                                >
                                                    保存为文件
                                                </Button>
                                            </div>
                                        </Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={6} 
                                            value={privateKey}
                                            readOnly
                                            className="font-monospace"
                                            style={{ fontSize: '0.8rem' }}
                                        />
                                        <Form.Text className="text-danger">
                                            ⚠️ * 请妥善保管私钥，切勿泄露 *
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <strong>🔐 Secret 1</strong>
                                            <div className="mt-1">
                                                <Button 
                                                    variant="outline-secondary" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => copyToClipboard(secret1)}
                                                >
                                                    复制
                                                </Button>
                                                <Button 
                                                    variant="outline-dark" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => saveToLocalFile(secret1, 'secret1.txt')}
                                                >
                                                    保存
                                                </Button>
                                            </div>
                                        </Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={secret1}
                                            readOnly
                                            className="font-monospace"
                                        />
                                    </Form.Group>
                                </Col>
                                
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <strong>🔐 Secret 2</strong>
                                            <div className="mt-1">
                                                <Button 
                                                    variant="outline-secondary" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => copyToClipboard(secret2)}
                                                >
                                                    复制
                                                </Button>
                                                <Button 
                                                    variant="outline-dark" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => saveToLocalFile(secret2, 'secret2.txt')}
                                                >
                                                    保存
                                                </Button>
                                            </div>
                                        </Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={secret2}
                                            readOnly
                                            className="font-monospace"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* 保存历史记录 */}
                            {savedFiles.length > 0 && (
                                <Alert variant="light" className="mt-3">
                                    <Alert.Heading>📁 最近保存的文件</Alert.Heading>
                                    <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                        {savedFiles.slice(-3).map((file, index) => (
                                            <div key={index} className="small text-muted">
                                                • {file.filename} - {file.timestamp}
                                            </div>
                                        ))}
                                    </div>
                                </Alert>
                            )}

                            <div className="mt-4 d-flex flex-wrap gap-2">
                                <Button 
                                    variant="outline-primary"
                                    onClick={testEncryption}
                                >
                                    🔒 测试加密解密
                                </Button>
                                
                                <Button 
                                    variant="outline-success"
                                    onClick={handleGenerateAll}
                                >
                                    🔄 重新生成
                                </Button>
                                
                                <Button 
                                    variant="outline-warning"
                                    onClick={saveAllToLocal}
                                >
                                    💾 一键保存所有
                                </Button>
                                
                                <Button 
                                    variant="outline-danger"
                                    onClick={handleReset}
                                >
                                    🗑️ 重置全部
                                </Button>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
            <br/>
        </Container>
    );
};

export default SummonCertificate;
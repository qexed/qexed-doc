import React from 'react';

const List2 = ({ children }) => {
  // 动态注入支持多级嵌套的样式
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      /* 基础列表样式 */
      .custom-ordered-list {
        list-style: none;
        counter-reset: list-counter;
        padding-left: 2em;
        margin: 8px 0;
      }

      /* 所有层级列表项通用样式 */
      .custom-ordered-list > li {
        counter-increment: list-counter;
        position: relative;
        margin-bottom: 6px;
      }

      /* 主编号 (1) (2) */
      .custom-ordered-list > li::before {
        content: "("counter(list-counter)")";
        display: inline-block;
        width: 2.5em;
        margin-left: -2.5em;
        position: absolute;
        left: 0;
        font-weight: 500;
        color: #2d3748;
      }

      /* 二级嵌套列表 */
      .custom-ordered-list .custom-ordered-list {
        padding-left: 3em;
        counter-reset: sublist-counter;
      }

      /* 二级编号 (1.1) (1.2) */
      .custom-ordered-list .custom-ordered-list > li::before {
        content: "("counter(list-counter)"."counter(sublist-counter)")";
        counter-increment: sublist-counter;
        width: 3.5em;
        margin-left: -3.5em;
      }

      /* 三级嵌套列表 */
      .custom-ordered-list .custom-ordered-list .custom-ordered-list {
        padding-left: 4em;
        counter-reset: sublist2-counter;
      }

      /* 三级编号 (1.1.1) (1.1.2) */
      .custom-ordered-list .custom-ordered-list .custom-ordered-list > li::before {
        content: "(" counter(list-counter) "." counter(sublist-counter) "." counter(sublist2-counter) ")";
        counter-increment: sublist2-counter;
        width: 4.5em;
        margin-left: -4.5em;
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <ol className="custom-ordered-list">
      {React.Children.map(children, (child, index) => {
        if (child.type !== 'li') return null;
        return React.cloneElement(child, {
          key: index,
          ...child.props
        });
      })}
    </ol>
  );
};

export default List2;
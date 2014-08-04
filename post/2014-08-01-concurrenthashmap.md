## Map学习
### HashMap和HashTable

HashMap允许一个主键为Null，允许Value为Null，线程不安全。反观HashTable不允许键值为空，但支持多线程同步。可以通过如下方式得到HashMap的一个同步视图：

    Map synMap = Collections.synchronizedMap (new HashMap(...));
    
TreeMap实现了Map的子接口SortedMap，采用红黑树作为底层存储结构，提供了按照键排序的Map存储。

### 线程安全的Map

除了用上面方法对HashMap包装后支持线程同步之外，Java5开始有了ConcurrentHashMap，支持高并发、高吞吐量的线程安全HashMap实现。

实现原理：
锁分离，不同的段公用一个锁。

### Map的第四种实现LinkedHashMap

LinkedHashMap 是HashMap的一个子类，保存了记录的插入顺序，在用Iterator遍历LinkedHashMap时，先得到的记录肯定是先插入的.也可以在构造时用带参数，按照应用次数排序。

### WeakHashMap

在Java集合中有一种特殊的Map类型——WeakHashMap，在这种Map中存放了键对象的弱引用，当一个键对象被垃圾回收器回收时，那么相应的值对象的引用会从Map中删除。WeakHashMap能够节省存储空间，可用来缓存那些非必须存在的数据。 
原理：Entry<K,V>继承自WeakReference<K>。
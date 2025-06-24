
export const metadata = {
  title: "The Gospel | Devontae Reid",
  description: "The good news of Jesus Christ - God's plan of salvation for humanity",
};

export default function Gospel() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            The Gospel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The good news of Jesus Christ - God&apos;s plan of salvation for humanity
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-16">
          {/* What is the Gospel */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              What is the Gospel?
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                The word &quot;gospel&quot; means &quot;good news.&quot; The gospel is the good news that God has provided 
                a way for sinful humanity to be reconciled to Him through the life, death, and resurrection 
                of Jesus Christ.
              </p>
              <blockquote className="border-l-4 border-blue-500 pl-6 my-8 italic text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 py-4 rounded-r-lg">
                &quot;For God so loved the world, that he gave his only Son, that whoever believes in him 
                should not perish but have eternal life.&quot; - John 3:16
              </blockquote>
            </div>
          </section>

          {/* The Problem */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              The Problem: Sin and Separation
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    We Are All Sinners
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    The Bible teaches that all people have sinned and fall short of God&apos;s perfect standard 
                    (Romans 3:23). Sin is not just doing bad things, but living in rebellion against God 
                    and His ways.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>We have broken God&apos;s law</li>
                    <li>We are spiritually dead in our sins</li>
                    <li>We are separated from God</li>
                    <li>We deserve God&apos;s judgment</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    The Consequences
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Sin has serious consequences. It separates us from God, brings death, and leads to 
                    eternal separation from God in hell.
                  </p>
                  <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-700 dark:text-gray-300">
                    &quot;For the wages of sin is death, but the free gift of God is eternal life in Christ 
                    Jesus our Lord.&quot; - Romans 6:23
                  </blockquote>
                </div>
              </div>
            </div>
          </section>

          {/* The Solution */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              The Solution: Jesus Christ
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">👑</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Jesus is God
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Jesus Christ is fully God and fully man. He lived a perfect, sinless life and is 
                    the only one qualified to pay the penalty for our sins.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">✝️</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Jesus Died for Us
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Jesus willingly died on the cross, taking the punishment we deserve for our sins. 
                    His death satisfied God&apos;s justice and made forgiveness possible.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Jesus Rose Again
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Jesus rose from the dead, proving He is God and that His sacrifice was accepted. 
                    His resurrection gives us hope for eternal life.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Response */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              The Response: Repent and Believe
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Repentance
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Repentance means turning away from sin and turning toward God. It involves:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Recognizing your sin and need for forgiveness</li>
                    <li>Being sorry for your sins</li>
                    <li>Turning away from sinful ways</li>
                    <li>Desiring to live for God</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Faith
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Faith means trusting in Jesus Christ alone for salvation. It involves:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Believing that Jesus is God</li>
                    <li>Trusting that Jesus died for your sins</li>
                    <li>Relying on Jesus for salvation</li>
                    <li>Following Jesus as Lord</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* The Promise */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              The Promise: New Life
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  What happens when you trust in Jesus?
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Immediate Benefits
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <li>Your sins are forgiven</li>
                      <li>You are reconciled to God</li>
                      <li>You receive eternal life</li>
                      <li>You become a child of God</li>
                      <li>You receive the Holy Spirit</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Ongoing Transformation
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <li>God helps you grow in holiness</li>
                      <li>You find purpose and meaning</li>
                      <li>You experience God&apos;s peace</li>
                      <li>You become part of God&apos;s family</li>
                      <li>You have hope for the future</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-6">
                Will You Trust in Jesus Today?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                If you want to receive God&apos;s gift of salvation, you can pray something like this:
              </p>
              <div className="bg-white/10 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                <p className="text-lg italic">
                  &quot;Dear God, I know I am a sinner and need your forgiveness. I believe that Jesus 
                  died on the cross for my sins and rose from the dead. I want to turn from my sins 
                  and trust in Jesus as my Savior and Lord. Please forgive me and give me eternal life. 
                  Thank you for your love and grace. In Jesus&apos; name, Amen.&quot;
                </p>
              </div>
              <p className="text-lg mb-8">
                If you prayed this prayer or have questions about the gospel, we&apos;d love to hear from you!
              </p>
              <a
                href="mailto:devontae.reid@gmail.com"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Get In Touch
              </a>
            </div>
          </section>

          {/* Additional Resources */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Additional Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Bible Reading
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Start reading the Bible to learn more about God and His plan for your life.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• John (to learn about Jesus)</li>
                  <li>• Romans (to understand salvation)</li>
                  <li>• Psalms (for worship and prayer)</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Find a Church
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Connect with other believers and grow in your faith by joining a local church.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Look for a church that teaches the Bible faithfully and loves people genuinely.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 
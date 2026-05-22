
export const metadata = {
  title: "The Gospel | Devontae Reid",
  description: "The good news of Jesus Christ - God's plan of salvation for humanity",
};

export default function Gospel() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ background: "var(--dr-cream)" }}>
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
            <div className="rounded-lg shadow-lg p-8" style={{ background: "var(--dr-surface)" }}>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                The word &quot;gospel&quot; means &quot;good news.&quot; The gospel is the good news that God has provided 
                a way for sinful humanity to be reconciled to Him through the life, death, and resurrection 
                of Jesus Christ.
              </p>
              <blockquote className="pl-6 my-8 italic text-gray-700 dark:text-gray-300 py-4 px-6 rounded-lg border border-dr-border" style={{ background: "var(--dr-cream)" }}>
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
            <div className="rounded-lg shadow-lg p-8" style={{ background: "var(--dr-surface)" }}>
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
                  <blockquote className="pl-4 italic text-gray-700 dark:text-gray-300 p-4 rounded-lg border border-dr-border" style={{ background: "var(--dr-cream)" }}>
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
            <div className="rounded-lg shadow-lg p-8" style={{ background: "var(--dr-surface)" }}>
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
            <div className="rounded-lg shadow-lg p-8" style={{ background: "var(--dr-surface)" }}>
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
            <div className="rounded-lg shadow-lg p-8" style={{ background: "var(--dr-surface)" }}>
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
          <section>
            <div className="rounded-lg p-8 text-white" style={{ background: "var(--dr-amber)" }}>
              <div className="max-w-2xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">
                  Repent and Believe the Gospel
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  This is not an invitation to recite a formula. It is the command of the risen Lord to every person: turn from sin and trust in Christ alone.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white/10 rounded-lg p-6 text-left">
                  <h3 className="text-xl font-semibold mb-3">What Repentance Means</h3>
                  <p className="text-white/90 leading-relaxed mb-3">
                    Repentance is not mere sorrow over consequences. It is a genuine turning of the heart from sin and toward God — forsaking your own way, your self-righteousness, and your rebellion against him.
                  </p>
                  <p className="text-white/80 text-sm italic">
                    &quot;God commands all people everywhere to repent.&quot; — Acts 17:30
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 text-left">
                  <h3 className="text-xl font-semibold mb-3">What Faith Rests On</h3>
                  <p className="text-white/90 leading-relaxed mb-3">
                    Faith is not a decision or a feeling — it is resting entirely on Christ and his finished work. He bore the wrath you deserved. He rose as Lord. Trust in him alone, not in your repentance or your sincerity.
                  </p>
                  <p className="text-white/80 text-sm italic">
                    &quot;For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.&quot; — Ephesians 2:8
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6 mb-10 text-center max-w-2xl mx-auto">
                <p className="text-xl italic leading-relaxed">
                  &quot;Whoever comes to me I will never cast out.&quot;
                </p>
                <p className="text-white/80 mt-2 text-sm">— John 6:37</p>
              </div>

              <div className="text-center">
                <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto">
                  If God is drawing you, do not delay. Come to Christ now — cast yourself on his mercy, confess your sin, and trust his promise. He is faithful to receive all who come.
                </p>
                <a
                  href="mailto:devontae.reid@gmail.com"
                  className="hover:opacity-90 px-8 py-3 rounded-lg font-medium transition-opacity inline-block"
                  style={{ background: "var(--dr-cream)", color: "var(--dr-amber-deep)" }}
                >
                  Have Questions? Reach Out
                </a>
              </div>
            </div>
          </section>

          {/* Additional Resources */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Additional Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-dr-surface rounded-lg shadow-lg p-6 border border-dr-border">
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
              <div className="bg-dr-surface rounded-lg shadow-lg p-6 border border-dr-border">
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